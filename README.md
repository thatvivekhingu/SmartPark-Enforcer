# SmartPark-Enforcer AI — Production Enforcement Prototype

> **SmartPark-Enforcer uses computer vision to detect and track vehicles in restricted parking zones, verifies illegal parking using a 2-minute dwell-time rule, extracts the number plate, captures evidence, and automatically generates a tamper-evident digital violation ticket.**

---

## 🚀 4 CORE SYSTEM CAPABILITIES

1. **Real-Time Detection & ByteTrack Tracking**:
   - Uses PyTorch, Ultralytics YOLO11, and ByteTrack.
   - Detects Cars and Bikes/Motorcycles from RTSP CCTV streams or local test MP4 video (`videos/test_cctv.mp4`).
   - Maintains persistent `track_id` across frames without duplicate counting.

2. **Smart No-Parking Geo-Fence & 120s Dwell-Time Engine**:
   - Uses Shapely `Polygon` for configurable No-Parking Zones.
   - Calculates vehicle center points `(x_center, y_center)` and checks containment inside polygon.
   - Accumulates dwell time; confirms violation only after **120 seconds (2 minutes)**.
   - Exiting before 120s cancels timer (0 violation). Staying after 120s generates exactly **one violation per parking event (zero duplicate challans)**.

3. **Number Plate Recognition & Evidence Capture**:
   - Vehicle Crop $\rightarrow$ Plate Detection $\rightarrow$ Plate Crop $\rightarrow$ Normalized OCR.
   - Converts text to uppercase, strips whitespace/special chars, falls back to `UNKNOWN` if low confidence (never hallucinates plate numbers).
   - Automatically saves annotated violation frame to `evidence/violations/` and cropped plate image to `evidence/plates/`.

4. **Tamper-Evident Digital Challan & SQLite Storage**:
   - Generates a deterministic SHA-256 hash using Python `hashlib.sha256()`.
   - Stores `vehicles`, `detections`, `violations`, and `challans` in SQLite (`backend/smartpark.db`).
   - Displays Digital Challan Card with SHA-256 hash certificate on the React dashboard.

---

## 📁 REPOSITORY STRUCTURE

```text
SmartPark-Enforcer/
├── config/
│   └── config.yaml               # Camera, Geo-Fence Polygon, Dwell Time Threshold
├── datasets/
│   ├── illegal_parking/          # Illegal Parking Detection.v1i.yolov11
│   ├── plate_trace/              # archive (2) PlateTrace OCR
│   └── traffic/                  # archive (3) IITM HeTra Traffic
├── notebooks/
│   ├── Model.ipynb               # Illegal Parking Detection Notebook
│   ├── Model_v2.ipynb            # PlateTrace OCR Notebook
│   └── Model_v3.ipynb            # IITM HeTra Traffic Notebook
├── models/
│   ├── illegal_parking.pt        # YOLO11 Transfer Learning Model
│   ├── plate_ocr.pt              # PlateTrace Model
│   ├── traffic.pt                # Traffic Monitoring Model
│   └── onnx/                     # ONNX Optimized Models
├── backend/
│   ├── main.py                   # Centralized AI Pipeline & FastAPI REST API
│   ├── database.py               # SQLite Schema (SQLAlchemy & Pydantic)
│   └── requirements.txt          # Backend Dependencies
├── frontend/                     # React + Vite + Tailwind Dashboard
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   │       ├── Header.jsx
│   │       ├── LiveFeed.jsx
│   │       ├── ActiveViolations.jsx
│   │       └── DigitalChallanCard.jsx
│   └── package.json
├── evidence/
│   ├── violations/               # Annotated Evidence Frame Images
│   └── plates/                   # Cropped Plate Images
├── videos/
│   └── test_cctv.mp4             # Synthetic CCTV Test Video (135s @ 10fps)
└── README.md
```

---

## 🛠️ HOW TO RUN THE PROJECT

### 1. Start FastAPI AI Backend Server
```bash
python backend/main.py
```
*API Base URL*: `http://localhost:8000`  
*Live MJPEG Stream*: `http://localhost:8000/api/stream`

### 2. Start React Enforcement Dashboard
```bash
cd frontend
npm install
npm run dev
```
*Dashboard URL*: `http://localhost:3000`
