import datetime
import hashlib
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import declarative_base, sessionmaker
from pydantic import BaseModel

DB_PATH = "sqlite:///backend/smartpark.db"
engine = create_engine(DB_PATH, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class VehicleModel(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    track_id = Column(Integer, unique=True, index=True)
    vehicle_type = Column(String, default="car")
    plate_number = Column(String, default="UNKNOWN")
    first_seen = Column(DateTime, default=datetime.datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="TRACKING")

class DetectionModel(Base):
    __tablename__ = "detections"
    id = Column(Integer, primary_key=True, index=True)
    track_id = Column(Integer, index=True)
    vehicle_type = Column(String)
    confidence = Column(Float)
    in_geofence = Column(Integer, default=0)
    dwell_time = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class ViolationModel(Base):
    __tablename__ = "violations"
    id = Column(Integer, primary_key=True, index=True)
    violation_id = Column(String, unique=True, index=True)
    track_id = Column(Integer)
    vehicle_type = Column(String)
    vehicle_number = Column(String, default="UNKNOWN")
    camera_id = Column(String, default="CAM-01")
    location = Column(String, default="No-Parking Bay 1")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    dwell_time = Column(Float, default=120.0)
    violation_type = Column(String, default="Illegal Parking (>120s)")
    evidence_image = Column(String)
    plate_image = Column(String)
    sha256_hash = Column(String)
    status = Column(String, default="CONFIRMED")

class ChallanModel(Base):
    __tablename__ = "challans"
    id = Column(Integer, primary_key=True, index=True)
    challan_id = Column(String, unique=True, index=True)
    violation_id = Column(String, index=True)
    vehicle_number = Column(String)
    vehicle_type = Column(String)
    issued_at = Column(DateTime, default=datetime.datetime.utcnow)
    fine_amount = Column(Integer, default=500)
    sha256_hash = Column(String)
    evidence_image = Column(String)
    status = Column(String, default="ISSUED")

class ViolationSchema(BaseModel):
    id: int
    violation_id: str
    track_id: int
    vehicle_type: str
    vehicle_number: str
    camera_id: str
    location: str
    timestamp: str
    dwell_time: float
    violation_type: str
    evidence_image: str
    plate_image: str
    sha256_hash: str
    status: str
    class Config:
        from_attributes = True

class ChallanSchema(BaseModel):
    id: int
    challan_id: str
    violation_id: str
    vehicle_number: str
    vehicle_type: str
    issued_at: str
    fine_amount: int
    sha256_hash: str
    evidence_image: str
    status: str
    class Config:
        from_attributes = True

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def compute_sha256_from_files(file_paths: list) -> str:
    hasher = hashlib.sha256()
    for fp in file_paths:
        if fp and __import__("os").path.exists(fp):
            with open(fp, "rb") as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hasher.update(chunk)
    return hasher.hexdigest()

def generate_sha256_hash(violation_data: dict) -> str:
    evidence_file = violation_data.get("evidence_image", "")
    plate_file = violation_data.get("plate_image", "")
    root = __import__("pathlib").Path(__file__).resolve().parent.parent
    ev_abs = str(root / evidence_file) if evidence_file else None
    pl_abs = str(root / plate_file) if plate_file else None
    return compute_sha256_from_files([ev_abs, pl_abs])

def create_violation_and_challan(db, data: dict):
    existing = db.query(ViolationModel).filter(ViolationModel.track_id == data["track_id"]).first()
    if existing:
        return existing, None

    now = datetime.datetime.utcnow()
    v_id = f"VIOL-{now.strftime('%Y%m%d%H%M%S')}-{data['track_id']}"
    c_id = f"CHAL-{now.strftime('%Y%m%d%H%M%S')}-{data['track_id']}"

    data["violation_id"] = v_id
    data["timestamp"] = now
    sha_hash = generate_sha256_hash(data)

    violation = ViolationModel(
        violation_id=v_id,
        track_id=data["track_id"],
        vehicle_type=data.get("vehicle_type", "car"),
        vehicle_number=data.get("vehicle_number", "UNKNOWN"),
        camera_id=data.get("camera_id", "CAM-01"),
        location=data.get("location", "No-Parking Zone 1"),
        timestamp=now,
        dwell_time=data.get("dwell_time", 120.0),
        violation_type="Illegal Parking (>120s)",
        evidence_image=data.get("evidence_image", ""),
        plate_image=data.get("plate_image", ""),
        sha256_hash=sha_hash,
        status="CONFIRMED"
    )
    db.add(violation)

    challan = ChallanModel(
        challan_id=c_id,
        violation_id=v_id,
        vehicle_number=data.get("vehicle_number", "UNKNOWN"),
        vehicle_type=data.get("vehicle_type", "car"),
        issued_at=now,
        fine_amount=500,
        sha256_hash=sha_hash,
        evidence_image=data.get("evidence_image", ""),
        status="ISSUED"
    )
    db.add(challan)
    db.commit()
    db.refresh(violation)
    db.refresh(challan)
    return violation, challan

def get_all_violations(db):
    return db.query(ViolationModel).order_by(ViolationModel.id.desc()).all()

def get_all_challans(db):
    return db.query(ChallanModel).order_by(ChallanModel.id.desc()).all()

def get_latest_challan(db):
    return db.query(ChallanModel).order_by(ChallanModel.id.desc()).first()
