import { API_BASE } from "./constants";
import type { SystemStats, Violation, Challan, TrackerEntry, EvidenceVerification } from "@/types";

const DEMO_STATS: SystemStats = {
  total_vehicles: 105,
  active_vehicles: 3,
  total_violations: 15,
  total_challans: 15,
  ocr_available: true,
};

const DEMO_VIOLATIONS: Violation[] = [
  {
    id: 1,
    vehicle_id: "VEH-178",
    violation_type: "Illegal Parking (5-Min Dwell Limit)",
    timestamp: "2026-08-20 09:02:15",
    dwell_seconds: 305,
    geofence_name: "Street No-Parking Curb",
    evidence_image_path: "/evidence/violations/violation_youtube_test_tr89_20260819_184818.jpg",
    evidence_plate_path: "/evidence/plates/plate_youtube_test_tr89_20260819_184818.jpg",
    ocr_text: "NL01C7821",
    ocr_confidence: 0.96,
    sha256_hash: "8d757e4b98eb3b5b53c7ddcf9e2dc4102cb9f3fc24bdecaa38310020ab44d362",
    latitude: 26.1584,
    longitude: 94.5624,
    status: "CONFIRMED",
    vehicle: {
      id: "VEH-178",
      license_plate: "NL01C7821",
      vehicle_type: "car",
      color: "Silver Maruti Suzuki",
      registered_owner: "State Registry Verified",
      created_at: "2026-08-20 08:57:10",
      updated_at: "2026-08-20 09:02:15",
    },
  },
  {
    id: 2,
    vehicle_id: "VEH-192",
    violation_type: "Illegal Parking (5-Min Dwell Limit)",
    timestamp: "2026-08-20 09:03:02",
    dwell_seconds: 312,
    geofence_name: "Commercial Bay No-Parking",
    evidence_image_path: "/evidence/violations/violation_parking_cctv_1_tr18_20260819_184602.jpg",
    evidence_plate_path: "/evidence/plates/plate_parking_cctv_1_tr18_20260819_184602.jpg",
    ocr_text: "NL07B4419",
    ocr_confidence: 0.93,
    sha256_hash: "8d740741b3b00cac073072e23e9ead273d46834da278d665d10beded4bc3bbf7",
    latitude: 26.1586,
    longitude: 94.5627,
    status: "CONFIRMED",
    vehicle: {
      id: "VEH-192",
      license_plate: "NL07B4419",
      vehicle_type: "car",
      color: "White SUV",
      registered_owner: "State Registry Verified",
      created_at: "2026-08-20 08:57:50",
      updated_at: "2026-08-20 09:03:02",
    },
  },
  {
    id: 3,
    vehicle_id: "VEH-193",
    violation_type: "Illegal Parking (5-Min Dwell Limit)",
    timestamp: "2026-08-20 09:03:45",
    dwell_seconds: 318,
    geofence_name: "Street Curb No-Parking",
    evidence_image_path: "/evidence/violations/violation_parking_cctv_1_tr23_20260819_184606.jpg",
    evidence_plate_path: "/evidence/plates/plate_parking_cctv_1_tr23_20260819_184606.jpg",
    ocr_text: "NL01A9310",
    ocr_confidence: 0.91,
    sha256_hash: "8d6fdf7c37b215041a30f22899bb596ee3387a74441ebd29f527df97165e605c",
    latitude: 26.1589,
    longitude: 94.5630,
    status: "CONFIRMED",
    vehicle: {
      id: "VEH-193",
      license_plate: "NL01A9310",
      vehicle_type: "car",
      color: "Black SUV",
      registered_owner: "State Registry Verified",
      created_at: "2026-08-20 08:58:27",
      updated_at: "2026-08-20 09:03:45",
    },
  },
];

const DEMO_CHALLANS: Challan[] = [
  {
    id: 1,
    violation_id: 1,
    challan_number: "CHAL-20260820-0178",
    fine_amount: 500,
    issued_at: "2026-08-20 09:02:18",
    status: "issued",
    sha256_hash: "8d757e4b98eb3b5b53c7ddcf9e2dc4102cb9f3fc24bdecaa38310020ab44d362",
    violation: DEMO_VIOLATIONS[0],
  },
  {
    id: 2,
    violation_id: 2,
    challan_number: "CHAL-20260820-0192",
    fine_amount: 500,
    issued_at: "2026-08-20 09:03:05",
    status: "issued",
    sha256_hash: "8d740741b3b00cac073072e23e9ead273d46834da278d665d10beded4bc3bbf7",
    violation: DEMO_VIOLATIONS[1],
  },
  {
    id: 3,
    violation_id: 3,
    challan_number: "CHAL-20260820-0193",
    fine_amount: 500,
    issued_at: "2026-08-20 09:03:48",
    status: "issued",
    sha256_hash: "8d6fdf7c37b215041a30f22899bb596ee3387a74441ebd29f527df97165e605c",
    violation: DEMO_VIOLATIONS[2],
  },
];

const DEMO_TRACKERS: TrackerEntry[] = [
  {
    vehicle_id: "VEH-178",
    license_plate: "NL01C7821",
    vehicle_type: "car",
    first_seen: "08:57:10",
    last_seen: "09:02:15",
    dwell_seconds: 305,
    detections: 180,
  },
  {
    vehicle_id: "VEH-192",
    license_plate: "NL07B4419",
    vehicle_type: "car",
    first_seen: "08:57:50",
    last_seen: "09:03:02",
    dwell_seconds: 312,
    detections: 165,
  },
  {
    vehicle_id: "VEH-193",
    license_plate: "NL01A9310",
    vehicle_type: "car",
    first_seen: "08:58:27",
    last_seen: "09:03:45",
    dwell_seconds: 318,
    detections: 154,
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
      stored_hash: "8d757e4b98eb3b5b53c7ddcf9e2dc4102cb9f3fc24bdecaa38310020ab44d362",
      computed_hash: "8d757e4b98eb3b5b53c7ddcf9e2dc4102cb9f3fc24bdecaa38310020ab44d362",
      match: true,
    }
  );
}
