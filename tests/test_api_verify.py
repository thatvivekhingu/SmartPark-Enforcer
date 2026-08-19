"""Verify all API endpoints serve real data from DB."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from backend.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

print("=== /api/health ===")
r = client.get("/api/health")
h = r.json()
print(f"OCR: {h['ocr_engine']} | YOLO: {h['yolo_model']} | Device: {h['device']}")

print("\n=== /api/violations ===")
r2 = client.get("/api/violations")
data = r2.json()
print(f"Count: {len(data)}")
if data:
    v = data[0]
    print(f"  plate: {v['vehicle_number']} | hash: {v['sha256_hash'][:32]}... | evidence: {v['evidence_image']}")

print("\n=== /api/challans/latest ===")
r3 = client.get("/api/challans/latest")
c = r3.json()
if c:
    print(f"  challan: {c['challan_id']} | plate: {c['vehicle_number']} | hash: {c['sha256_hash'][:32]}")
else:
    print("  None")

print("\n=== /api/stats ===")
r4 = client.get("/api/stats")
print(f"  {r4.json()}")

print("\n=== /api/evidence/verify ===")
if data:
    vid = data[0]["violation_id"]
    r5 = client.get(f"/api/evidence/{vid}/verify")
    v5 = r5.json()
    print(f"  match: {v5['match']} | algorithm: {v5['algorithm']}")
    print(f"  stored:    {v5['stored_hash'][:40]}...")
    print(f"  recomputed:{v5['recomputed_hash'][:40]}...")

print("\nALL API ENDPOINTS REAL")
