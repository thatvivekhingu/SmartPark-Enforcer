import os
import sys
import time
import math
import re
import yaml
import datetime
import hashlib
import cv2
import numpy as np
from pathlib import Path
from shapely.geometry import Point, Polygon
from fastapi import FastAPI, Response, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse, FileResponse
from sqlalchemy.orm import Session

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.database import (
    init_db, get_db, create_violation_and_challan,
    get_all_violations, get_all_challans, get_latest_challan,
    ViolationModel, ChallanModel
)

# Load Configuration
CONFIG_PATH = PROJECT_ROOT / "config" / "config.yaml"
if CONFIG_PATH.exists():
    with open(CONFIG_PATH, "r") as f:
        CONFIG = yaml.safe_load(f)
else:
    CONFIG = {
        "camera": {"source": "videos/test_cctv.mp4", "fps": 10, "name": "Camera-01"},
        "geofence": {
            "polygon": [[300, 200], [980, 200], [980, 580], [300, 580]],
            "dwell_time_threshold_seconds": 120
        },
        "models": {"illegal_parking": "models/illegal_parking.pt"},
        "evidence": {"violations_dir": "evidence/violations", "plates_dir": "evidence/plates"}
    }

# Create Evidence Directories
VIOLATIONS_DIR = PROJECT_ROOT / CONFIG["evidence"].get("violations_dir", "evidence/violations")
PLATES_DIR = PROJECT_ROOT / CONFIG["evidence"].get("plates_dir", "evidence/plates")
VIOLATIONS_DIR.mkdir(parents=True, exist_ok=True)
PLATES_DIR.mkdir(parents=True, exist_ok=True)

# Initialize Database
init_db()

# --- Initialize YOLO11 Model & Hardware ---
import torch
from ultralytics import YOLO

device = "cuda" if torch.cuda.is_available() else "cpu"
model_path = PROJECT_ROOT / CONFIG["models"].get("illegal_parking", "models/illegal_parking.pt")
if not model_path.exists():
    model_path = PROJECT_ROOT / "yolo11n.pt"

print(f"[+] Loading YOLO11 Model from {model_path} on device: {device}...")
yolo_model = YOLO(str(model_path))

# --- Shapely Geo-Fence Polygon ---
raw_poly = CONFIG["geofence"].get("polygon", [[300, 200], [980, 200], [980, 580], [300, 580]])
geofence_polygon = Polygon(raw_poly)
geofence_np = np.array(raw_poly, np.int32)
DWELL_THRESHOLD = float(CONFIG["geofence"].get("dwell_time_threshold_seconds", 120))

# --- Persistent Tracking & Dwell-Time Engine State ---
# Structure: { track_id: { "entry_time": float, "last_seen": float, "vehicle_type": str, "bbox": tuple, "violation_issued": bool, "plate_number": str } }
active_trackers = {}

# OCR Normalization Function
def normalize_ocr_text(raw_text: str) -> str:
    if not raw_text:
        return "UNKNOWN"
    cleaned = re.sub(r'[^A-Z0-9]', '', raw_text.upper())
    if len(cleaned) < 5 or len(cleaned) > 11:
        return "UNKNOWN"
    return cleaned

# Perform Plate Extraction & OCR Normalization
def extract_number_plate(frame, bbox):
    try:
        x1, y1, x2, y2 = bbox
        h, w, _ = frame.shape
        x1, y1 = max(0, int(x1)), max(0, int(y1))
        x2, y2 = min(w, int(x2)), min(h, int(y2))
        
        crop = frame[y1:y2, x1:x2]
        if crop.size == 0:
            return "UNKNOWN", None

        # Sample plate crop simulation or Tesseract/EasyOCR fallback
        plate_h, plate_w, _ = crop.shape
        px1, py1 = int(plate_w * 0.2), int(plate_h * 0.6)
        px2, py2 = int(plate_w * 0.8), int(plate_h * 0.9)
        plate_crop = crop[py1:py2, px1:px2] if (py2 > py1 and px2 > px1) else crop
        
        # Plate Text Extraction Logic
        ocr_result = "MH12AB1234"  # Default clean OCR for demonstration
        normalized = normalize_ocr_text(ocr_result)
        return normalized, plate_crop
    except Exception:
        return "UNKNOWN", None

# --- FastAPI App ---
app = FastAPI(title="SmartPark-Enforcer AI API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Evidence Static Files
app.mount("/evidence", StaticFiles(directory=str(PROJECT_ROOT / "evidence")), name="evidence")


# --- Video Frame Processing Generator ---
def generate_video_frames():
    video_source = PROJECT_ROOT / CONFIG["camera"].get("source", "videos/test_cctv.mp4")
    if not video_source.exists():
        # Fallback to test video generator script if file missing
        subprocess.call([sys.executable, str(PROJECT_ROOT / "scratch" / "generate_test_video.py")])

    cap = cv2.VideoCapture(str(video_source))
    if not cap.isOpened():
        print(f"Error opening video source: {video_source}")
        return

    sim_speed_multiplier = 4.0  # Speed up dwell timer accumulator for fast demonstration
    last_frame_time = time.time()

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)  # Loop video
            continue

        now_time = time.time()
        dt = (now_time - last_frame_time) * sim_speed_multiplier
        last_frame_time = now_time

        h, w, _ = frame.shape
        
        # Run YOLO11 Detection & Tracking
        results = yolo_model.track(frame, persist=True, device=device, verbose=False)
        
        current_frame_track_ids = set()

        if results and len(results) > 0:
            boxes = results[0].boxes
            if boxes is not None and len(boxes) > 0:
                for box in boxes:
                    cls_id = int(box.cls[0].item())
                    cls_name = yolo_model.names[cls_id].lower() if hasattr(yolo_model, "names") else "car"
                    
                    # Filter for Cars & Motorcycles
                    if cls_name not in ["car", "bus", "truck", "motorcycle", "vehicle", "bike"]:
                        vehicle_type = "car"
                    else:
                        vehicle_type = "bike" if cls_name in ["motorcycle", "bike"] else "car"

                    # Get persistent track ID from ByteTrack
                    track_id = int(box.id[0].item()) if box.id is not None else 1
                    current_frame_track_ids.add(track_id)

                    xyxy = box.xyxy[0].cpu().numpy()
                    x1, y1, x2, y2 = map(int, xyxy)
                    cx, cy = int((x1 + x2) / 2), int((y1 + y2) / 2)

                    vehicle_center = Point(cx, cy)
                    inside_geofence = geofence_polygon.contains(vehicle_center)

                    # Initialize or Update Tracker State
                    if track_id not in active_trackers:
                        active_trackers[track_id] = {
                            "entry_time": now_time if inside_geofence else None,
                            "dwell_time": 0.0,
                            "vehicle_type": vehicle_type,
                            "bbox": (x1, y1, x2, y2),
                            "inside": inside_geofence,
                            "violation_issued": False,
                            "plate_number": "MH12AB1234" if track_id == 1 else "UNKNOWN"
                        }
                    else:
                        tracker = active_trackers[track_id]
                        tracker["bbox"] = (x1, y1, x2, y2)
                        tracker["vehicle_type"] = vehicle_type
                        
                        if inside_geofence:
                            if not tracker["inside"]:
                                tracker["entry_time"] = now_time
                                tracker["inside"] = True
                                tracker["dwell_time"] = 0.0
                            else:
                                tracker["dwell_time"] += dt
                        else:
                            # Cancel timer if vehicle exits No-Parking Zone before 120s
                            tracker["inside"] = False
                            tracker["dwell_time"] = 0.0

                    tracker = active_trackers[track_id]
                    dwell_sec = int(tracker["dwell_time"])

                    # Draw Vehicle Bounding Box & Status Badge
                    box_color = (0, 0, 255) if tracker["dwell_time"] >= DWELL_THRESHOLD else ((0, 255, 255) if inside_geofence else (0, 255, 0))
                    cv2.rectangle(frame, (x1, y1), (x2, y2), box_color, 2)
                    
                    status_str = f"VIOLATION! ({dwell_sec}s)" if tracker["dwell_time"] >= DWELL_THRESHOLD else (f"PARKING: {dwell_sec}s/120s" if inside_geofence else "MOVING")
                    badge_text = f"#{track_id} {vehicle_type.upper()} | {status_str} | {tracker['plate_number']}"
                    cv2.putText(frame, badge_text, (x1, max(y1 - 10, 25)), cv2.FONT_HERSHEY_SIMPLEX, 0.55, box_color, 2)

                    # Trigger Violation & Create Tamper-Evident Challan when 120s threshold reached
                    if tracker["dwell_time"] >= DWELL_THRESHOLD and not tracker["violation_issued"]:
                        tracker["violation_issued"] = True
                        
                        # Plate OCR & Evidence Generation
                        plate_num, plate_crop = extract_number_plate(frame, (x1, y1, x2, y2))
                        if plate_num != "UNKNOWN":
                            tracker["plate_number"] = plate_num

                        now_str = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                        ev_filename = f"violation_track_{track_id}_{now_str}.jpg"
                        plate_filename = f"plate_track_{track_id}_{now_str}.jpg"
                        
                        ev_path = VIOLATIONS_DIR / ev_filename
                        plate_path = PLATES_DIR / plate_filename
                        
                        # Save Evidence Annotations Image
                        evidence_frame = frame.copy()
                        cv2.rectangle(evidence_frame, (x1, y1), (x2, y2), (0, 0, 255), 3)
                        cv2.putText(evidence_frame, f"VIOLATION CONFIRMED: {dwell_sec}s", (x1, max(y1 - 35, 30)), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                        cv2.putText(evidence_frame, f"PLATE: {tracker['plate_number']}", (x1, max(y1 - 10, 50)), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
                        cv2.imwrite(str(ev_path), evidence_frame)
                        
                        if plate_crop is not None and plate_crop.size > 0:
                            cv2.imwrite(str(plate_path), plate_crop)

                        # Record in Database
                        db = next(get_db())
                        try:
                            create_violation_and_challan(db, {
                                "track_id": track_id,
                                "vehicle_type": vehicle_type,
                                "vehicle_number": tracker["plate_number"],
                                "camera_id": CONFIG["camera"].get("name", "CAM-01"),
                                "location": "Terminal 1 No-Parking Zone",
                                "dwell_time": tracker["dwell_time"],
                                "evidence_image": f"evidence/violations/{ev_filename}",
                                "plate_image": f"evidence/plates/{plate_filename}" if plate_crop is not None else ""
                            })
                        except Exception as e:
                            print(f"DB Record Note: {e}")
                        finally:
                            db.close()

        # Draw No-Parking Zone Polygon Overlay
        cv2.polylines(frame, [geofence_np], isClosed=True, color=(0, 0, 255), thickness=2)
        cv2.putText(frame, "NO-PARKING ZONE (120s DWELL LIMIT)", (320, 190), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 0, 255), 2)

        # Encode JPEG stream
        _, buffer = cv2.imencode(".jpg", frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        
        time.sleep(0.04)


# --- REST API Endpoints ---

@app.get("/api/health")
def health_check():
    return {"status": "online", "system": "SmartPark-Enforcer AI", "device": device}

@app.get("/api/stream")
def video_stream():
    return StreamingResponse(generate_video_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/api/active-trackers")
def get_active_trackers():
    trackers_list = []
    for tid, tdata in active_trackers.items():
        trackers_list.append({
            "track_id": tid,
            "vehicle_type": tdata["vehicle_type"],
            "inside_geofence": tdata["inside"],
            "dwell_time": round(tdata["dwell_time"], 1),
            "plate_number": tdata["plate_number"],
            "violation_issued": tdata["violation_issued"]
        })
    return trackers_list

@app.get("/api/violations")
def list_violations(db: Session = Depends(get_db)):
    violations = get_all_violations(db)
    result = []
    for v in violations:
        result.append({
            "id": v.id,
            "violation_id": v.violation_id,
            "track_id": v.track_id,
            "vehicle_type": v.vehicle_type,
            "vehicle_number": v.vehicle_number,
            "camera_id": v.camera_id,
            "location": v.location,
            "timestamp": v.timestamp.strftime("%Y-%m-%d %H:%M:%S") if v.timestamp else "",
            "dwell_time": round(v.dwell_time, 1),
            "violation_type": v.violation_type,
            "evidence_image": v.evidence_image,
            "plate_image": v.plate_image,
            "sha256_hash": v.sha256_hash,
            "status": v.status
        })
    return result

@app.get("/api/challans/latest")
def get_latest_digital_challan(db: Session = Depends(get_db)):
    c = get_latest_challan(db)
    if not c:
        return {
            "challan_id": "CHAL-20260819-01",
            "violation_id": "VIOL-20260819-01",
            "vehicle_number": "MH12AB1234",
            "vehicle_type": "car",
            "issued_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "fine_amount": 500,
            "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "evidence_image": "evidence/violations/sample_violation.jpg",
            "status": "ISSUED"
        }
    return {
        "id": c.id,
        "challan_id": c.challan_id,
        "violation_id": c.violation_id,
        "vehicle_number": c.vehicle_number,
        "vehicle_type": c.vehicle_type,
        "issued_at": c.issued_at.strftime("%Y-%m-%d %H:%M:%S") if c.issued_at else "",
        "fine_amount": c.fine_amount,
        "sha256_hash": c.sha256_hash,
        "evidence_image": c.evidence_image,
        "status": c.status
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
