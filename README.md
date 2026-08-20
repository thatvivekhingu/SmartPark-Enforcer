# SmartPark-Enforcer AI — Law Enforcement & Traffic SOC Command Center

> **SmartPark-Enforcer uses computer vision (Ultralytics YOLO11 + ByteTrack) to detect and track vehicles in restricted parking zones, verifies illegal parking using a continuous dwell-time rule, extracts number plates, captures evidence frames, and automatically generates tamper-evident digital violation tickets (SHA-256).**

---

## 🌐 LIVE DEPLOYMENT LINKS

* **Primary Production Dashboard**: [https://frontend-eta-five-fw1ibd9ae3.vercel.app/](https://frontend-eta-five-fw1ibd9ae3.vercel.app/)
* **Main Branch Deployment**: [https://frontend-git-main-vivek-hingu-s-projects.vercel.app/](https://frontend-git-main-vivek-hingu-s-projects.vercel.app/)
* **Preview Deployment**: [https://frontend-1f3vgg3xc-vivek-hingu-s-projects.vercel.app/](https://frontend-1f3vgg3xc-vivek-hingu-s-projects.vercel.app/)

---

## 🚀 4 CORE CAPABILITIES

1. **Real-Time Detection & ByteTrack Persistent Tracking**:
   - Uses PyTorch, Ultralytics YOLO11, and ByteTrack.
   - Detects Cars, Motorcycles, Buses, and Trucks from RTSP CCTV streams or local test videos.
   - Assigns and preserves unique persistent `track_id` (`#1`, `#2`... `#99`) across frames with zero duplicate vehicle counts.

2. **Smart No-Parking Geo-Fence & Dwell-Time Engine**:
   - Uses Shapely `Polygon` for configurable No-Parking Zones.
   - Calculates vehicle center points `(x_center, y_center)` and checks polygon containment.
   - Accumulates dwell time; triggers violation only when dwell threshold is exceeded.
   - Exit before limit $\rightarrow$ Resets timer (0 violation). Remain after limit $\rightarrow$ Exactly **one confirmed violation per parking event (zero duplicate challans)**.

3. **Number Plate Recognition & Evidence Capture**:
   - Vehicle Crop $\rightarrow$ Plate Detection $\rightarrow$ Plate Crop $\rightarrow$ Normalized OCR.
   - Converts text to uppercase, strips whitespace/special chars, falls back to `UNKNOWN` if low confidence (never hallucinates plate numbers).
   - Automatically saves annotated violation frame to `evidence/violations/` and cropped plate image to `evidence/plates/`.

4. **Tamper-Evident Digital Challan & SQLite Persistence**:
   - Generates a deterministic SHA-256 hash using Python `hashlib.sha256()`.
   - Stores `vehicles`, `detections`, `violations`, and `challans` in SQLite (`backend/smartpark.db`).
   - Displays Digital Challan Card with SHA-256 hash certificate on the React dashboard.

---

## 📊 REAL YOUTUBE CCTV DETECTION DATASET

The system has been verified on real-world YouTube parking & traffic surveillance footage with automated batch inference:

| Video Name | Source / Scene | Frames / Duration | Vehicles Tracked | Detections Logged | Real Violations |
|---|---|---|---|---|---|
| **`parking_bay_3.mp4`** | Real Mall Parking CCTV | 457 frames (15.2s) | **11 vehicles** | 294 detections | **1 violation** |
| **`parking_cctv_1.mp4`** | Real Street Parking CCTV | 721 frames (24.1s) | **8 vehicles** | 843 detections | **5 violations** |
| **`traffic_junction_2.mp4`** | Real City Junction Footage | 688 frames (28.7s) | **7 vehicles** | 109 detections | Moving Traffic (0) |
| **`youtube_test.mp4`** | Real Commercial Lot Video | 1,608 frames (53.6s) | **79 vehicles** | 1,840 detections | **9 violations** |
| **TOTAL** | **5 Real Videos** | **3,474 Frames** | **105 Vehicles** | **3,086 Detections** | **15 Violations** |

*Structured Dataset Manifest*: [`evidence/detection_dataset.json`](evidence/detection_dataset.json)

---

## 📁 REPOSITORY STRUCTURE

```text
SmartPark-Enforcer/
├── config/
│   └── config.yaml               # Camera, Geo-Fence Polygon, Dwell Time Threshold
├── datasets/
│   ├── illegal_parking/          # Illegal Parking Detection Dataset
│   ├── plate_trace/              # PlateTrace OCR Dataset
│   └── traffic/                  # IITM HeTra Traffic Dataset
├── notebooks/
│   ├── Model.ipynb               # Illegal Parking Detection Training Notebook
│   ├── Model_v2.ipynb            # PlateTrace OCR Training Notebook
│   └── Model_v3.ipynb            # IITM HeTra Traffic Training Notebook
├── models/
│   ├── illegal_parking.pt        # YOLO11 Model Weights
│   ├── plate_ocr.pt              # PlateTrace Model Weights
│   └── traffic.pt                # Traffic Monitoring Model Weights
├── backend/
│   ├── main.py                   # Centralized AI Enforcement Pipeline & REST API
│   ├── batch_detect.py           # Multi-Video Batch Detection & Dataset Generator
│   ├── database.py               # SQLite Schema (SQLAlchemy & Pydantic)
│   └── requirements.txt          # Backend Dependencies
├── frontend/                     # Streamlined React + Vite + Tailwind Dashboard
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   │       ├── Header.jsx
│   │       ├── LiveFeed.jsx
│   │       ├── ActiveViolations.jsx
│   │       └── DigitalChallanCard.jsx
│   └── package.json
├── evidence/
│   ├── detection_dataset.json    # Full Structured Detection & Violation Manifest
│   ├── violations/               # 15+ Real Annotated Evidence Frame Captures
│   └── plates/                   # Cropped Plate Images
├── videos/                       # Real CCTV & Parking MP4 Test Videos
└── README.md
```

---

## 🛠️ HOW TO RUN LOCALLY

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

### 3. Run Batch Video Detection on All Videos
```bash
python backend/batch_detect.py
```
