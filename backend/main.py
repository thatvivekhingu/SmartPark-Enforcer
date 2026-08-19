import os
import sys
import time
import re
import subprocess
import datetime
import hashlib
import cv2
import numpy as np
from pathlib import Path
from shapely.geometry import Point, Polygon
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse, FileResponse
from sqlalchemy.orm import Session
from collections import defaultdict

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.database import (
    init_db, get_db, create_violation_and_challan,
    get_all_violations, get_all_challans, get_latest_challan,
    ViolationModel, ChallanModel, compute_sha256_from_files,
)

import yaml
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

VIOLATIONS_DIR = PROJECT_ROOT / CONFIG["evidence"].get("violations_dir", "evidence/violations")
PLATES_DIR = PROJECT_ROOT / CONFIG["evidence"].get("plates_dir", "evidence/plates")
VIOLATIONS_DIR.mkdir(parents=True, exist_ok=True)
PLATES_DIR.mkdir(parents=True, exist_ok=True)

init_db()

import torch
from ultralytics import YOLO

device = "cuda" if torch.cuda.is_available() else "cpu"
model_path = PROJECT_ROOT / CONFIG["models"].get("illegal_parking", "models/illegal_parking.pt")
if not model_path.exists():
    model_path = PROJECT_ROOT / "yolo11n.pt"

print(f"[+] Loading YOLO11 Model from {model_path} on device: {device}...")
yolo_model = YOLO(str(model_path))

raw_poly = CONFIG["geofence"].get("polygon", [[300, 200], [980, 200], [980, 580], [300, 580]])
geofence_polygon = Polygon(raw_poly)
geofence_np = np.array(raw_poly, np.int32)
DWELL_THRESHOLD = float(CONFIG["geofence"].get("dwell_time_threshold_seconds", 120))

active_trackers = {}

ocr_reader = None
ocr_load_error = None

def get_ocr_reader():
    global ocr_reader, ocr_load_error
    if ocr_reader is not None:
        return ocr_reader
    try:
        import easyocr
        print("[+] Loading EasyOCR reader (English)...")
        ocr_reader = easyocr.Reader(['en'], gpu=False)
        print("[+] EasyOCR reader loaded successfully.")
        return ocr_reader
    except Exception as e:
        ocr_load_error = str(e)
        print(f"[!] EasyOCR failed to load: {e}")
        ocr_reader = False
        return None

def normalize_plate_text(raw_text: str) -> str:
    if not raw_text:
        return "UNKNOWN"
    cleaned = re.sub(r'[^A-Z0-9]', '', raw_text.upper().strip())
    if len(cleaned) < 5 or len(cleaned) > 11:
        return "UNKNOWN"
    return cleaned

def preprocess_plate_image(crop_bgr):
    gray = cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, None, fx=2.5, fy=2.5, interpolation=cv2.INTER_CUBIC)
    gray = cv2.normalize(gray, None, 0, 255, cv2.NORM_MINMAX)
    gray = cv2.bilateralFilter(gray, 9, 75, 75)
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return thresh

def extract_number_plate(frame, bbox):
    try:
        x1, y1, x2, y2 = bbox
        h, w, _ = frame.shape
        x1, y1 = max(0, int(x1)), max(0, int(y1))
        x2, y2 = min(w, int(x2)), min(h, int(y2))

        if x2 <= x1 or y2 <= y1:
            return "UNKNOWN", None

        crop = frame[y1:y2, x1:x2]
        if crop.size == 0:
            return "UNKNOWN", None

        plate_h, plate_w = crop.shape[:2]
        px1 = int(plate_w * 0.15)
        py1 = int(plate_h * 0.55)
        px2 = int(plate_w * 0.85)
        py2 = int(plate_h * 0.95)
        plate_crop = crop[py1:py2, px1:px2] if (py2 > py1 and px2 > px1) else crop

        reader = get_ocr_reader()
        if reader is None or reader is False:
            return "UNKNOWN", plate_crop

        processed = preprocess_plate_image(plate_crop)
        results = reader.readtext(processed)

        if results:
            ranked = sorted(results, key=lambda r: r[2], reverse=True)
            for bbox_r, text, conf in ranked:
                if conf < 0.3:
                    continue
                normalized = normalize_plate_text(text)
                if normalized != "UNKNOWN":
                    return normalized, plate_crop
            return normalize_plate_text(ranked[0][1]), plate_crop

        return "UNKNOWN", plate_crop
    except Exception:
        return "UNKNOWN", None

app = FastAPI(title="SmartPark-Enforcer AI API", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/evidence", StaticFiles(directory=str(PROJECT_ROOT / "evidence")), name="evidence")

connected_websockets: list[WebSocket] = []

async def broadcast_ws(event_type: str, data: dict):
    message = {"event": event_type, "data": data}
    import json
    text = json.dumps(message, default=str)
    dead = []
    for ws in connected_websockets:
        try:
            await ws.send_text(text)
        except Exception:
            dead.append(ws)
    for ws in dead:
        if ws in connected_websockets:
            connected_websockets.remove(ws)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_websockets.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            import json
            await websocket.send_text(json.dumps({"event": "pong", "data": data}))
    except WebSocketDisconnect:
        if websocket in connected_websockets:
            connected_websockets.remove(websocket)
    except Exception:
        if websocket in connected_websockets:
            connected_websockets.remove(websocket)

def generate_video_frames():
    video_source = PROJECT_ROOT / CONFIG["camera"].get("source", "videos/test_cctv.mp4")
    if not video_source.exists():
        print(f"[!] Video source not found: {video_source}")
        return

    cap = cv2.VideoCapture(str(video_source))
    if not cap.isOpened():
        print(f"Error opening video source: {video_source}")
        return

    sim_speed_multiplier = 4.0
    last_frame_time = time.time()

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue

        now_time = time.time()
        dt = (now_time - last_frame_time) * sim_speed_multiplier
        last_frame_time = now_time

        h, w, _ = frame.shape
        results = yolo_model.track(frame, persist=True, device=device, verbose=False)

        current_frame_track_ids = set()

        if results and len(results) > 0:
            boxes = results[0].boxes
            if boxes is not None and len(boxes) > 0:
                for box in boxes:
                    cls_id = int(box.cls[0].item())
                    cls_name = yolo_model.names[cls_id].lower() if hasattr(yolo_model, "names") else "car"

                    if cls_name not in ["car", "bus", "truck", "motorcycle", "vehicle", "bike"]:
                        vehicle_type = "car"
                    else:
                        vehicle_type = "bike" if cls_name in ["motorcycle", "bike"] else "car"

                    track_id = int(box.id[0].item()) if box.id is not None else 1
                    current_frame_track_ids.add(track_id)

                    xyxy = box.xyxy[0].cpu().numpy()
                    x1, y1, x2, y2 = map(int, xyxy)
                    cx, cy = int((x1 + x2) / 2), int((y1 + y2) / 2)

                    vehicle_center = Point(cx, cy)
                    inside_geofence = geofence_polygon.contains(vehicle_center)

                    if track_id not in active_trackers:
                        active_trackers[track_id] = {
                            "entry_time": now_time if inside_geofence else None,
                            "dwell_time": 0.0,
                            "vehicle_type": vehicle_type,
                            "bbox": (x1, y1, x2, y2),
                            "inside": inside_geofence,
                            "violation_issued": False,
                            "plate_number": "UNKNOWN",
                            "confidence": float(box.conf[0].item()),
                            "last_update": now_time,
                        }
                    else:
                        tracker = active_trackers[track_id]
                        tracker["bbox"] = (x1, y1, x2, y2)
                        tracker["vehicle_type"] = vehicle_type
                        tracker["confidence"] = float(box.conf[0].item())
                        tracker["last_update"] = now_time

                        if inside_geofence:
                            if not tracker["inside"]:
                                tracker["entry_time"] = now_time
                                tracker["inside"] = True
                                tracker["dwell_time"] = 0.0
                            else:
                                tracker["dwell_time"] += dt
                        else:
                            tracker["inside"] = False
                            tracker["dwell_time"] = 0.0

                    tracker = active_trackers[track_id]
                    dwell_sec = int(tracker["dwell_time"])

                    box_color = (0, 0, 255) if tracker["dwell_time"] >= DWELL_THRESHOLD else ((0, 255, 255) if inside_geofence else (0, 255, 0))
                    cv2.rectangle(frame, (x1, y1), (x2, y2), box_color, 2)
                    status_str = f"VIOLATION! ({dwell_sec}s)" if tracker["dwell_time"] >= DWELL_THRESHOLD else (f"PARKING: {dwell_sec}s/{int(DWELL_THRESHOLD)}s" if inside_geofence else "MOVING")
                    badge_text = f"#{track_id} {vehicle_type.upper()} | {status_str} | {tracker['plate_number']}"
                    cv2.putText(frame, badge_text, (x1, max(y1 - 10, 25)), cv2.FONT_HERSHEY_SIMPLEX, 0.55, box_color, 2)

                    if tracker["dwell_time"] >= DWELL_THRESHOLD and not tracker["violation_issued"]:
                        tracker["violation_issued"] = True

                        plate_num, plate_crop_img = extract_number_plate(frame, (x1, y1, x2, y2))
                        tracker["plate_number"] = plate_num

                        now_str = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                        ev_filename = f"violation_track_{track_id}_{now_str}.jpg"
                        plate_filename = f"plate_track_{track_id}_{now_str}.jpg"

                        ev_path = VIOLATIONS_DIR / ev_filename
                        plate_path = PLATES_DIR / plate_filename

                        evidence_frame = frame.copy()
                        cv2.rectangle(evidence_frame, (x1, y1), (x2, y2), (0, 0, 255), 3)
                        cv2.putText(evidence_frame, f"VIOLATION CONFIRMED: {dwell_sec}s", (x1, max(y1 - 35, 30)), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                        cv2.putText(evidence_frame, f"PLATE: {tracker['plate_number']}", (x1, max(y1 - 10, 50)), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
                        cv2.imwrite(str(ev_path), evidence_frame)

                        plate_saved = False
                        if plate_crop_img is not None and plate_crop_img.size > 0:
                            cv2.imwrite(str(plate_path), plate_crop_img)
                            plate_saved = True

                        evidence_rel = f"evidence/violations/{ev_filename}"
                        plate_rel = f"evidence/plates/{plate_filename}" if plate_saved else ""
                        ev_abs = str(ev_path)
                        pl_abs = str(plate_path) if plate_saved else None
                        real_sha256 = compute_sha256_from_files([ev_abs, pl_abs])

                        db = next(get_db())
                        try:
                            viol, challan = create_violation_and_challan(db, {
                                "track_id": track_id,
                                "vehicle_type": vehicle_type,
                                "vehicle_number": tracker["plate_number"],
                                "camera_id": CONFIG["camera"].get("name", "CAM-01"),
                                "location": "Terminal 1 No-Parking Zone",
                                "dwell_time": tracker["dwell_time"],
                                "evidence_image": evidence_rel,
                                "plate_image": plate_rel,
                            })
                            if viol:
                                ws_payload = {
                                    "violation_id": viol.violation_id,
                                    "track_id": track_id,
                                    "vehicle_type": vehicle_type,
                                    "vehicle_number": tracker["plate_number"],
                                    "camera_id": viol.camera_id,
                                    "location": viol.location,
                                    "dwell_time": round(tracker["dwell_time"], 1),
                                    "sha256_hash": real_sha256,
                                    "evidence_image": evidence_rel,
                                    "plate_image": plate_rel,
                                    "status": "CONFIRMED",
                                    "timestamp": viol.timestamp.strftime("%Y-%m-%d %H:%M:%S") if viol.timestamp else "",
                                }
                                import asyncio
                                try:
                                    loop = asyncio.get_event_loop()
                                    if loop.is_running():
                                        import concurrent.futures
                                        with concurrent.futures.ThreadPoolExecutor() as pool:
                                            pool.submit(asyncio.run, broadcast_ws("VIOLATION_CREATED", ws_payload)).result()
                                except Exception:
                                    pass
                        except Exception as e:
                            print(f"DB Record Error: {e}")
                        finally:
                            db.close()

        cv2.polylines(frame, [geofence_np], isClosed=True, color=(0, 0, 255), thickness=2)
        cv2.putText(frame, f"NO-PARKING ZONE ({int(DWELL_THRESHOLD)}s DWELL LIMIT)", (320, 190), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 0, 255), 2)

        _, buffer = cv2.imencode(".jpg", frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

        time.sleep(0.04)

@app.get("/api/health")
def health_check():
    ocr_status = "READY"
    try:
        reader = get_ocr_reader()
        if reader is None or reader is False:
            ocr_status = "NOT_AVAILABLE"
    except Exception as e:
        ocr_status = f"ERROR: {e}"

    return {
        "status": "online",
        "system": "SmartPark-Enforcer AI",
        "device": device,
        "yolo_model": str(model_path.name),
        "ocr_engine": ocr_status,
        "ocr_error": ocr_load_error,
        "active_trackers": len(active_trackers),
        "websocket_clients": len(connected_websockets),
    }

@app.get("/api/stream")
def video_stream():
    return StreamingResponse(generate_video_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/api/active-trackers")
def get_active_trackers():
    now = time.time()
    result = []
    for tid, tdata in active_trackers.items():
        stale = (now - tdata.get("last_update", 0)) > 5
        result.append({
            "track_id": tid,
            "vehicle_type": tdata["vehicle_type"],
            "inside_geofence": tdata["inside"],
            "dwell_time": round(tdata["dwell_time"], 1),
            "plate_number": tdata["plate_number"],
            "confidence": round(tdata["confidence"], 3),
            "bbox": list(tdata["bbox"]),
            "violation_issued": tdata["violation_issued"],
            "stale": stale,
        })
    return result

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    total_violations = db.query(ViolationModel).count()
    total_challans = db.query(ChallanModel).count()
    active = [t for t in active_trackers.values() if not t.get("violation_issued")]
    in_zone = [t for t in active if t.get("inside")]
    return {
        "tracked": len(active_trackers),
        "in_zone": len(in_zone),
        "violations": total_violations,
        "challans": total_challans,
        "ocr_status": "READY" if (get_ocr_reader() not in (None, False)) else "NOT_AVAILABLE",
        "websocket_clients": len(connected_websockets),
    }

@app.get("/api/violations")
def list_violations(db: Session = Depends(get_db)):
    violations = get_all_violations(db)
    return [{
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
    } for v in violations]

@app.get("/api/challans")
def list_challans(db: Session = Depends(get_db)):
    challans = get_all_challans(db)
    return [{
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
    } for c in challans]

@app.get("/api/challans/latest")
def get_latest_digital_challan(db: Session = Depends(get_db)):
    c = get_latest_challan(db)
    if not c:
        return None
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

@app.get("/api/evidence/{violation_id}/verify")
def verify_evidence(violation_id: str, db: Session = Depends(get_db)):
    from backend.database import ViolationModel
    v = db.query(ViolationModel).filter(ViolationModel.violation_id == violation_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Violation not found")

    root = PROJECT_ROOT
    ev_abs = str(root / v.evidence_image) if v.evidence_image else None
    pl_abs = str(root / v.plate_image) if v.plate_image else None
    recomputed = compute_sha256_from_files([ev_abs, pl_abs])

    return {
        "violation_id": violation_id,
        "stored_hash": v.sha256_hash,
        "recomputed_hash": recomputed,
        "match": v.sha256_hash == recomputed,
        "algorithm": "SHA-256",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
