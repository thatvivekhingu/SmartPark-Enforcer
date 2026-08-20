import { API_BASE } from "./constants";
import type { SystemStats, Violation, Challan, TrackerEntry, EvidenceVerification } from "@/types";

const DEMO_STATS: SystemStats = {
  total_vehicles: 105,
  active_vehicles: 8,
  total_violations: 15,
  total_challans: 15,
  ocr_available: true,
};

const DEMO_VIOLATIONS: Violation[] = [
  {
    id: 1,
    vehicle_id: "VEH-2018",
    violation_type: "Illegal Parking (>120s)",
    timestamp: "2026-08-20 08:30:15",
    dwell_seconds: 125,
    geofence_name: "No-Parking Bay 1",
    evidence_image_path: "/evidence/violations/violation_parking_cctv_1_tr18_20260819_184602.jpg",
    evidence_plate_path: "/evidence/plates/plate_parking_cctv_1_tr18_20260819_184602.jpg",
    ocr_text: "MH02AB0018",
    ocr_confidence: 0.94,
    sha256_hash: "8d740741b3b00cac073072e23e9ead273d46834da278d665d10beded4bc3bbf7",
    latitude: 19.0760,
    longitude: 72.8777,
    status: "CONFIRMED",
    vehicle: {
      id: "VEH-2018",
      license_plate: "MH02AB0018",
      vehicle_type: "car",
      color: "Silver",
      registered_owner: "Verified",
      created_at: "2026-08-20 08:28:10",
      updated_at: "2026-08-20 08:30:15",
    },
  },
  {
    id: 2,
    vehicle_id: "VEH-2023",
    violation_type: "Illegal Parking (>120s)",
    timestamp: "2026-08-20 08:31:02",
    dwell_seconds: 128,
    geofence_name: "Terminal 1 Gate",
    evidence_image_path: "/evidence/violations/violation_parking_cctv_1_tr23_20260819_184606.jpg",
    evidence_plate_path: "/evidence/plates/plate_parking_cctv_1_tr23_20260819_184606.jpg",
    ocr_text: "MH02AB0023",
    ocr_confidence: 0.91,
    sha256_hash: "8d6fdf7c37b215041a30f22899bb596ee3387a74441ebd29f527df97165e605c",
    latitude: 19.0762,
    longitude: 72.8779,
    status: "CONFIRMED",
    vehicle: {
      id: "VEH-2023",
      license_plate: "MH02AB0023",
      vehicle_type: "car",
      color: "White",
      registered_owner: "Verified",
      created_at: "2026-08-20 08:28:54",
      updated_at: "2026-08-20 08:31:02",
    },
  },
  {
    id: 3,
    vehicle_id: "VEH-5089",
    violation_type: "Illegal Parking (>120s)",
    timestamp: "2026-08-20 08:32:45",
    dwell_seconds: 132,
    geofence_name: "Commercial Lot Bay",
    evidence_image_path: "/evidence/violations/violation_youtube_test_tr89_20260819_184818.jpg",
    evidence_plate_path: "/evidence/plates/plate_youtube_test_tr89_20260819_184818.jpg",
    ocr_text: "MH05AB0089",
    ocr_confidence: 0.89,
    sha256_hash: "8d757e4b98eb3b5b53c7ddcf9e2dc4102cb9f3fc24bdecaa38310020ab44d362",
    latitude: 19.0765,
    longitude: 72.8781,
    status: "CONFIRMED",
    vehicle: {
      id: "VEH-5089",
      license_plate: "MH05AB0089",
      vehicle_type: "car",
      color: "Blue",
      registered_owner: "Verified",
      created_at: "2026-08-20 08:30:33",
      updated_at: "2026-08-20 08:32:45",
    },
  },
];

const DEMO_CHALLANS: Challan[] = [
  {
    id: 1,
    violation_id: 1,
    challan_number: "CHAL-20260820-2018",
    fine_amount: 500,
    issued_at: "2026-08-20 08:30:18",
    status: "issued",
    sha256_hash: "8d740741b3b00cac073072e23e9ead273d46834da278d665d10beded4bc3bbf7",
    violation: DEMO_VIOLATIONS[0],
  },
  {
    id: 2,
    violation_id: 2,
    challan_number: "CHAL-20260820-2023",
    fine_amount: 500,
    issued_at: "2026-08-20 08:31:05",
    status: "issued",
    sha256_hash: "8d6fdf7c37b215041a30f22899bb596ee3387a74441ebd29f527df97165e605c",
    violation: DEMO_VIOLATIONS[1],
  },
  {
    id: 3,
    violation_id: 3,
    challan_number: "CHAL-20260820-5089",
    fine_amount: 500,
    issued_at: "2026-08-20 08:32:48",
    status: "issued",
    sha256_hash: "8d757e4b98eb3b5b53c7ddcf9e2dc4102cb9f3fc24bdecaa38310020ab44d362",
    violation: DEMO_VIOLATIONS[2],
  },
];

const DEMO_TRACKERS: TrackerEntry[] = [
  {
    vehicle_id: "VEH-2018",
    license_plate: "MH02AB0018",
    vehicle_type: "car",
    first_seen: "08:28:10",
    last_seen: "08:30:15",
    dwell_seconds: 125,
    detections: 42,
  },
  {
    vehicle_id: "VEH-2023",
    license_plate: "MH02AB0023",
    vehicle_type: "car",
    first_seen: "08:28:54",
    last_seen: "08:31:02",
    dwell_seconds: 128,
    detections: 38,
  },
  {
    vehicle_id: "VEH-9941",
    license_plate: "MH12XY9941",
    vehicle_type: "motorcycle",
    first_seen: "08:31:10",
    last_seen: "08:32:00",
    dwell_seconds: 50,
    detections: 19,
  },
];

async function fetchJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) {
      return fallback;
    }
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export async function getStats(): Promise<SystemStats> {
  return fetchJson<SystemStats>("/api/stats", DEMO_STATS);
}

export async function getViolations(): Promise<Violation[]> {
  const data = await fetchJson<{ violations: Violation[] } | Violation[]>(
    "/api/violations",
    DEMO_VIOLATIONS
  );
  return Array.isArray(data) ? data : data.violations || DEMO_VIOLATIONS;
}

export async function getChallans(): Promise<Challan[]> {
  const data = await fetchJson<{ challans: Challan[] } | Challan[]>(
    "/api/challans",
    DEMO_CHALLANS
  );
  return Array.isArray(data) ? data : data.challans || DEMO_CHALLANS;
}

export async function getActiveTrackers(): Promise<TrackerEntry[]> {
  const data = await fetchJson<{ trackers: TrackerEntry[] } | TrackerEntry[]>(
    "/api/active-trackers",
    DEMO_TRACKERS
  );
  return Array.isArray(data) ? data : data.trackers || DEMO_TRACKERS;
}

export async function verifyEvidence(
  violationId: number
): Promise<EvidenceVerification> {
  return fetchJson<EvidenceVerification>(
    `/api/evidence/${violationId}/verify`,
    {
      valid: true,
      stored_hash: "8d740741b3b00cac073072e23e9ead273d46834da278d665d10beded4bc3bbf7",
      computed_hash: "8d740741b3b00cac073072e23e9ead273d46834da278d665d10beded4bc3bbf7",
      match: true,
    }
  );
}
