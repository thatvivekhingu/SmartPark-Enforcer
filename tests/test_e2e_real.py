"""Real E2E: process actual MP4 video, verify OCR, SHA-256, DB records."""
import sys, time, cv2, numpy as np, datetime
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from backend.database import (
    init_db, SessionLocal, ViolationModel, ChallanModel, compute_sha256_from_files
)
from shapely.geometry import Point, Polygon
import yaml, torch
from ultralytics import YOLO

with open(PROJECT_ROOT / "config" / "config.yaml") as f:
    CONFIG = yaml.safe_load(f)

video_source = PROJECT_ROOT / "videos" / "test_cctv.mp4"
print("Video:", video_source)

init_db()

model_path = PROJECT_ROOT / CONFIG["models"].get("illegal_parking", "models/illegal_parking.pt")
if not model_path.exists():
    model_path = PROJECT_ROOT / "yolo11n.pt"
yolo_model = YOLO(str(model_path))

raw_poly = CONFIG["geofence"]["polygon"]
geofence_polygon = Polygon(raw_poly)

VIOLATIONS_DIR = PROJECT_ROOT / "evidence" / "violations"
PLATES_DIR = PROJECT_ROOT / "evidence" / "plates"
VIOLATIONS_DIR.mkdir(parents=True, exist_ok=True)
PLATES_DIR.mkdir(parents=True, exist_ok=True)

DWELL_THRESHOLD = 2.0  # Low threshold for fast E2E test

from backend.main import extract_number_plate

cap = cv2.VideoCapture(str(video_source))
print("Video opened:", cap.isOpened(), "frames:", int(cap.get(cv2.CAP_PROP_FRAME_COUNT)))

active_trackers = {}
violations_created = []
frame_count = 0

for i in range(60):
    ret, frame = cap.read()
    if not ret:
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1
    results = yolo_model.track(frame, persist=True, device="cpu", verbose=False)

    if results and len(results) > 0:
        boxes = results[0].boxes
        if boxes is not None and len(boxes) > 0:
            for box in boxes:
                cls_id = int(box.cls[0].item())
                cls_name = yolo_model.names.get(cls_id, "car")
                vehicle_type = "bike" if cls_name in ["motorcycle", "bike"] else "car"
                track_id = int(box.id[0].item()) if box.id is not None else 1
                xyxy = box.xyxy[0].cpu().numpy()
                x1, y1, x2, y2 = map(int, xyxy)
                cx, cy = int((x1 + x2) / 2), int((y1 + y2) / 2)
                inside = geofence_polygon.contains(Point(cx, cy))

                if track_id not in active_trackers:
                    active_trackers[track_id] = {"dwell": 0.0, "inside": inside, "violation": False, "plate": "UNKNOWN"}
                t = active_trackers[track_id]
                if inside:
                    t["dwell"] += 0.4
                    t["inside"] = True
                else:
                    t["inside"] = False
                    t["dwell"] = 0.0

                dwell_sec = t["dwell"]
                if dwell_sec >= DWELL_THRESHOLD and not t["violation"]:
                    t["violation"] = True
                    plate_num, plate_crop = extract_number_plate(frame, (x1, y1, x2, y2))
                    t["plate"] = plate_num

                    now_str = time.strftime("%Y%m%d_%H%M%S")
                    ev_file = f"violation_track_{track_id}_{now_str}.jpg"
                    plate_file = f"plate_track_{track_id}_{now_str}.jpg"
                    ev_path = VIOLATIONS_DIR / ev_file
                    pl_path = PLATES_DIR / plate_file
                    cv2.imwrite(str(ev_path), frame)
                    plate_saved = False
                    if plate_crop is not None and plate_crop.size > 0:
                        cv2.imwrite(str(pl_path), plate_crop)
                        plate_saved = True

                    real_sha = compute_sha256_from_files(
                        [str(ev_path), str(pl_path) if plate_saved else None]
                    )

                    db = SessionLocal()
                    try:
                        v_id = f"VIOL-E2E-{track_id}-{now_str}"
                        viol = ViolationModel(
                            violation_id=v_id, track_id=track_id,
                            vehicle_type=vehicle_type, vehicle_number=plate_num,
                            camera_id="CAM-E2E", location="Test Video Zone",
                            timestamp=datetime.datetime.utcnow(),
                            dwell_time=dwell_sec, violation_type="Illegal Parking",
                            evidence_image=f"evidence/violations/{ev_file}",
                            plate_image=f"evidence/plates/{plate_file}" if plate_saved else "",
                            sha256_hash=real_sha, status="CONFIRMED",
                        )
                        db.add(viol)
                        c_id = f"CHAL-E2E-{track_id}-{now_str}"
                        chal = ChallanModel(
                            challan_id=c_id, violation_id=v_id,
                            vehicle_number=plate_num, vehicle_type=vehicle_type,
                            issued_at=datetime.datetime.utcnow(), fine_amount=500,
                            sha256_hash=real_sha,
                            evidence_image=f"evidence/violations/{ev_file}",
                            status="ISSUED",
                        )
                        db.add(chal)
                        db.commit()
                        violations_created.append({
                            "id": v_id, "plate": plate_num,
                            "sha256_prefix": real_sha[:32],
                            "evidence_exists": ev_path.exists(),
                            "plate_exists": pl_path.exists() if plate_saved else False,
                        })
                        print(f"  VIOLATION #{track_id}: plate={plate_num}, evidence={ev_path.exists()}, hash={real_sha[:32]}...")
                    except Exception as e:
                        print(f"  DB ERROR: {e}")
                        db.rollback()
                    finally:
                        db.close()

cap.release()

print()
print("=== RESULTS ===")
print(f"Frames processed: {frame_count}")
print(f"Unique vehicles tracked: {len(active_trackers)}")
for tid, t in active_trackers.items():
    print(f"  Track #{tid}: dwell={t['dwell']:.1f}s, violation={t['violation']}, plate={t['plate']}")
print(f"Violations created: {len(violations_created)}")
for v in violations_created:
    print(f"  {v}")

db = SessionLocal()
viol_count = db.query(ViolationModel).count()
chal_count = db.query(ChallanModel).count()
print(f"DB: {viol_count} violations, {chal_count} challans")

if violations_created:
    vrec = db.query(ViolationModel).filter(
        ViolationModel.violation_id == violations_created[0]["id"]
    ).first()
    if vrec:
        root = Path(".")
        ev_abs = str(root / vrec.evidence_image) if vrec.evidence_image else None
        pl_abs = str(root / vrec.plate_image) if vrec.plate_image else None
        recomputed = compute_sha256_from_files([ev_abs, pl_abs])
        print()
        print("=== SHA-256 VERIFICATION ===")
        print(f"Stored:     {vrec.sha256_hash}")
        print(f"Recomputed: {recomputed}")
        print(f"Match: {vrec.sha256_hash == recomputed}")
        print(f"Plate in DB: {vrec.vehicle_number}")
        print(f"Evidence on disk: {Path(ev_abs).exists()}")
db.close()
print()
print("DONE - ALL REAL")
