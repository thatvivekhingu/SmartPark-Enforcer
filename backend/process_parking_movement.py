import sys
import cv2
import time
import math
import subprocess
from collections import deque
from pathlib import Path
import numpy as np

import torch
from ultralytics import YOLO
from shapely.geometry import Point, Polygon
import imageio_ffmpeg

# Paths
root = Path("c:/SmartPark-Enforcer")
model_path = root / "models" / "illegal_parking.pt"
if not model_path.exists():
    model_path = root / "yolo11n.pt"

video_path = root / "videos" / "youtube_test.mp4"
temp_output = root / "frontend" / "public" / "videos" / "temp_raw.mp4"
web_output = root / "frontend" / "public" / "videos" / "annotated_output.mp4"

print(f"[+] Loading YOLO11 model: {model_path}...")
model = YOLO(str(model_path))

cap = cv2.VideoCapture(str(video_path))
fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

print(f"[+] Video: {w}x{h} @ {fps:.1f}fps | {total_frames} frames ({total_frames/fps:.1f}s)")

# Define clear No-Parking Zone Polygon (covers the parking / restricted curb area)
geofence_poly = Polygon([[90, 75], [550, 75], [550, 315], [90, 315]])
geofence_np = np.array([[90, 75], [550, 75], [550, 315], [90, 315]], np.int32)

temp_output.parent.mkdir(parents=True, exist_ok=True)
fourcc = cv2.VideoWriter_fourcc(*"mp4v")
writer = cv2.VideoWriter(str(temp_output), fourcc, fps, (w, h))

trackers = {}
STATIONARY_DISPLACEMENT_THRESHOLD = 8.0  # max pixels moved to be considered parked
DWELL_VIOLATION_THRESHOLD = 4.0          # seconds of stationary dwell required for violation

frame_idx = 0
dt = 1.0 / fps

print("[*] Running Stationary vs Moving Vehicle Detection Engine...")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    frame_idx += 1

    annotated = frame.copy()

    # Draw No-Parking Zone Polygon with clear red/orange styling
    overlay = annotated.copy()
    cv2.fillPoly(overlay, [geofence_np], (0, 0, 80))
    cv2.addWeighted(overlay, 0.2, annotated, 0.8, 0, annotated)
    cv2.polylines(annotated, [geofence_np], isClosed=True, color=(0, 69, 255), thickness=2)
    cv2.putText(
        annotated,
        "NO-PARKING ZONE (MONITORING STATIONARY / PARKED VEHICLES)",
        (geofence_np[0][0] + 6, geofence_np[0][1] - 8),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.38,
        (0, 69, 255),
        1,
    )

    results = model.track(frame, persist=True, verbose=False, conf=0.32, iou=0.5)

    if results and len(results) > 0 and results[0].boxes is not None:
        boxes = results[0].boxes
        for box in boxes:
            cls_id = int(box.cls[0].item())
            cls_name = model.names[cls_id].lower()
            if cls_name not in ["car", "motorcycle", "bus", "truck", "vehicle", "bike"]:
                continue

            track_id = int(box.id[0].item()) if box.id is not None else 1
            bx1, by1, bx2, by2 = map(int, box.xyxy[0].cpu().numpy())
            cx, cy = (bx1 + bx2) // 2, (by1 + by2) // 2

            inside_zone = geofence_poly.contains(Point(cx, cy))

            if track_id not in trackers:
                trackers[track_id] = {
                    "history": deque(maxlen=20),
                    "dwell": 0.0,
                    "is_stationary": False,
                    "violation_issued": False,
                    "type": cls_name,
                }

            t = trackers[track_id]
            t["history"].append((cx, cy))

            # Motion / Velocity calculation over history window:
            if len(t["history"]) >= 8:
                first_x, first_y = t["history"][0]
                displacement = math.hypot(cx - first_x, cy - first_y)
                t["is_stationary"] = displacement < STATIONARY_DISPLACEMENT_THRESHOLD
            else:
                t["is_stationary"] = False

            # DWELL TIMER ONLY ACCUMULATES IF VEHICLE IS PARKED (STATIONARY) IN ZONE!
            # Moving vehicles that pass through do NOT accumulate violation dwell time.
            if inside_zone and t["is_stationary"]:
                t["dwell"] += dt
            elif not inside_zone:
                t["dwell"] = max(0.0, t["dwell"] - dt * 2)

            is_viol = t["dwell"] >= DWELL_VIOLATION_THRESHOLD

            v_type_str = t["type"].upper()

            if is_viol:
                # 🚨 VIOLATION CONFIRMED: Galat Parking (Red Box + Red Solid Tag)
                cv2.rectangle(annotated, (bx1, by1), (bx2, by2), (0, 0, 255), 2)

                tag = f"GALAT PARKING: #{track_id} {v_type_str} ({int(t['dwell'])}s)"
                (tw, th), _ = cv2.getTextSize(tag, cv2.FONT_HERSHEY_SIMPLEX, 0.42, 1)
                cv2.rectangle(
                    annotated,
                    (bx1, max(by1 - 22, 0)),
                    (bx1 + tw + 10, max(by1, 22)),
                    (0, 0, 255),
                    -1,
                )
                cv2.putText(
                    annotated,
                    tag,
                    (bx1 + 5, max(by1 - 6, 16)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.42,
                    (255, 255, 255),
                    1,
                )

            elif inside_zone and t["is_stationary"]:
                # ⚠️ PARKED / STATIONARY in No-Parking Zone (Orange Box + Accumulating)
                cv2.rectangle(annotated, (bx1, by1), (bx2, by2), (0, 165, 255), 2)

                tag = f"ILLEGAL PARKED #{track_id} | Dwell: {int(t['dwell'])}s/{int(DWELL_VIOLATION_THRESHOLD)}s"
                (tw, th), _ = cv2.getTextSize(tag, cv2.FONT_HERSHEY_SIMPLEX, 0.38, 1)
                cv2.rectangle(
                    annotated,
                    (bx1, max(by1 - 20, 0)),
                    (bx1 + tw + 8, max(by1, 20)),
                    (0, 140, 255),
                    -1,
                )
                cv2.putText(
                    annotated,
                    tag,
                    (bx1 + 4, max(by1 - 5, 15)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.38,
                    (0, 0, 0),
                    1,
                )

            else:
                # 🚗 MOVING NORMAL VEHICLE (Green Bounding Box - Clearly Marked as Normal Traffic!)
                cv2.rectangle(annotated, (bx1, by1), (bx2, by2), (0, 220, 100), 1)

                tag = f"MOVING #{track_id} ({t['type']})"
                cv2.putText(
                    annotated,
                    tag,
                    (bx1, max(by1 - 5, 12)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.35,
                    (0, 220, 100),
                    1,
                )

    writer.write(annotated)

cap.release()
writer.release()

print("[+] Raw video processed! Re-encoding to Web-Standard H.264 (AVC1)...")
ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
cmd = [
    ffmpeg_exe,
    "-y",
    "-i",
    str(temp_output),
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-preset",
    "fast",
    "-crf",
    "23",
    "-movflags",
    "+faststart",
    str(web_output),
]
subprocess.run(cmd, check=True)
if temp_output.exists():
    temp_output.unlink()

print(
    f"[🎉] Done! Final Web H.264 Video Saved: {web_output} ({web_output.stat().st_size / 1024 / 1024:.2f} MB)"
)
