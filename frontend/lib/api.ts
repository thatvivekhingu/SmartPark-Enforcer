import type {
  SystemStats,
  Violation,
  Challan,
  TrackerEntry,
  Camera,
  Analytics,
  UploadDetectionResult,
  ChallanGenerateRequest,
} from '@/types';
import { API_BASE } from './constants';

// ─── Helper ───────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO_STATS: SystemStats = {
  total_vehicles: 1284,
  active_vehicles: 37,
  total_violations: 256,
  total_challans: 198,
  ocr_available: true,
};

const DEMO_VIOLATIONS: Violation[] = [
  {
    id: 1,
    vehicle_id: 101,
    violation_type: 'OVERSTAY',
    timestamp: '2026-08-20T08:12:00Z',
    dwell_seconds: 2340,
    geofence_name: 'Zone A – Main Entrance',
    evidence_image_path: null,
    evidence_plate_path: null,
    ocr_text: 'NL01C7821',
    ocr_confidence: 0.97,
    sha256_hash: 'a3f9c12d8e4b7a1f2c6d3e8b4f9a0c5d2e7b1a4f8c3d6e9b2f5a8c1d4e7b0a3f',
    latitude: 19.076,
    longitude: 72.8777,
    status: 'CONFIRMED',
    vehicle: {
      id: 101,
      license_plate: 'NL01C7821',
      vehicle_type: 'Car',
      color: 'White',
      registered_owner: 'Ramesh Gupta',
      created_at: '2026-01-10T10:00:00Z',
      updated_at: '2026-08-20T08:12:00Z',
    },
  },
  {
    id: 2,
    vehicle_id: 102,
    violation_type: 'DOUBLE_PARK',
    timestamp: '2026-08-20T07:45:00Z',
    dwell_seconds: 1800,
    geofence_name: 'Zone B – Staff Parking',
    evidence_image_path: null,
    evidence_plate_path: null,
    ocr_text: 'MH02AB0018',
    ocr_confidence: 0.93,
    sha256_hash: 'b4e0d23c9f5a8b2e6d4c7f0a3e8b1d5f9c2a6e0b4d7f1a5c8e2b6d9f3a7c0e4',
    latitude: 19.0782,
    longitude: 72.8799,
    status: 'CONFIRMED',
    vehicle: {
      id: 102,
      license_plate: 'MH02AB0018',
      vehicle_type: 'Motorcycle',
      color: 'Black',
      registered_owner: 'Priya Sharma',
      created_at: '2026-02-14T09:00:00Z',
      updated_at: '2026-08-20T07:45:00Z',
    },
  },
  {
    id: 3,
    vehicle_id: 103,
    violation_type: 'WRONG_ZONE',
    timestamp: '2026-08-20T06:30:00Z',
    dwell_seconds: 900,
    geofence_name: 'Zone E – Reserved',
    evidence_image_path: null,
    evidence_plate_path: null,
    ocr_text: 'GJ05CX4402',
    ocr_confidence: 0.88,
    sha256_hash: 'c5f1e34d0a6b9c3f7e5d8a1b4c7f0e2d5a8c1f4b7e0d3a6f9c2e5b8d1f4a7e0',
    latitude: 19.0811,
    longitude: 72.882,
    status: 'PENDING',
    vehicle: {
      id: 103,
      license_plate: 'GJ05CX4402',
      vehicle_type: 'Truck',
      color: 'Red',
      registered_owner: 'Mehul Patel',
      created_at: '2026-03-01T08:30:00Z',
      updated_at: '2026-08-20T06:30:00Z',
    },
  },
  {
    id: 4,
    vehicle_id: 104,
    violation_type: 'OVERSTAY',
    timestamp: '2026-08-19T22:10:00Z',
    dwell_seconds: 4500,
    geofence_name: 'Zone C – Visitor Bay',
    evidence_image_path: null,
    evidence_plate_path: null,
    ocr_text: 'DL3CAB4419',
    ocr_confidence: 0.95,
    sha256_hash: 'd6a2f45e1b7c0d4f8a6e9c2d5b8f1e4a7c0d3b6f9e2a5c8d1f4b7e0a3f6c9d2',
    latitude: 28.6139,
    longitude: 77.209,
    status: 'CONFIRMED',
    vehicle: {
      id: 104,
      license_plate: 'DL3CAB4419',
      vehicle_type: 'Car',
      color: 'Silver',
      registered_owner: 'Anil Kumar',
      created_at: '2026-01-20T07:00:00Z',
      updated_at: '2026-08-19T22:10:00Z',
    },
  },
  {
    id: 5,
    vehicle_id: 105,
    violation_type: 'BLOCKED_EXIT',
    timestamp: '2026-08-19T18:55:00Z',
    dwell_seconds: 780,
    geofence_name: 'Zone D – Loading Dock',
    evidence_image_path: null,
    evidence_plate_path: null,
    ocr_text: 'KA03MF7712',
    ocr_confidence: 0.91,
    sha256_hash: 'e7b3a56f2c8d1e5a9b7f0c3d6a9b2e5c8f1d4a7e0b3d6f9a2c5e8b1d4f7a0c3',
    latitude: 12.9716,
    longitude: 77.5946,
    status: 'DISMISSED',
    vehicle: {
      id: 105,
      license_plate: 'KA03MF7712',
      vehicle_type: 'Van',
      color: 'Blue',
      registered_owner: 'Kavitha Reddy',
      created_at: '2026-04-05T11:00:00Z',
      updated_at: '2026-08-19T18:55:00Z',
    },
  },
  {
    id: 6,
    vehicle_id: 106,
    violation_type: 'NO_PERMIT',
    timestamp: '2026-08-19T15:20:00Z',
    dwell_seconds: 3600,
    geofence_name: 'Zone B – Staff Parking',
    evidence_image_path: null,
    evidence_plate_path: null,
    ocr_text: 'TN09BZ3341',
    ocr_confidence: 0.85,
    sha256_hash: 'f8c4b67a3d9e2f6b0c8a1d4e7b0c3f6a9d2e5b8c1f4a7d0e3b6f9c2a5e8b1d4',
    latitude: 13.0827,
    longitude: 80.2707,
    status: 'CONFIRMED',
    vehicle: {
      id: 106,
      license_plate: 'TN09BZ3341',
      vehicle_type: 'Auto',
      color: 'Yellow',
      registered_owner: 'Senthil Kumar',
      created_at: '2026-05-11T12:30:00Z',
      updated_at: '2026-08-19T15:20:00Z',
    },
  },
  {
    id: 7,
    vehicle_id: 107,
    violation_type: 'OVERSTAY',
    timestamp: '2026-08-19T11:05:00Z',
    dwell_seconds: 7200,
    geofence_name: 'Zone A – Main Entrance',
    evidence_image_path: null,
    evidence_plate_path: null,
    ocr_text: 'RJ14CC5589',
    ocr_confidence: 0.92,
    sha256_hash: 'a1d5c78b4e0f3a7c1d9e2b5f8a1c4e7b0d3f6a9c2e5b8d1f4a7e0b3c6f9a2e5',
    latitude: 26.9124,
    longitude: 75.7873,
    status: 'PENDING',
    vehicle: {
      id: 107,
      license_plate: 'RJ14CC5589',
      vehicle_type: 'Car',
      color: 'Grey',
      registered_owner: 'Vikram Singh',
      created_at: '2026-06-22T14:00:00Z',
      updated_at: '2026-08-19T11:05:00Z',
    },
  },
  {
    id: 8,
    vehicle_id: 108,
    violation_type: 'DOUBLE_PARK',
    timestamp: '2026-08-19T09:30:00Z',
    dwell_seconds: 1260,
    geofence_name: 'Zone C – Visitor Bay',
    evidence_image_path: null,
    evidence_plate_path: null,
    ocr_text: 'MH12DE6671',
    ocr_confidence: 0.96,
    sha256_hash: 'b2e6d89c5f1a4b8d2e0f3a6c9d2e5b8f1c4a7d0e3b6f9a2c5e8b1d4f7a0c3e6',
    latitude: 18.5204,
    longitude: 73.8567,
    status: 'CONFIRMED',
    vehicle: {
      id: 108,
      license_plate: 'MH12DE6671',
      vehicle_type: 'Bus',
      color: 'Orange',
      registered_owner: 'State Transport Corp',
      created_at: '2026-07-03T08:00:00Z',
      updated_at: '2026-08-19T09:30:00Z',
    },
  },
];

const DEMO_CHALLANS: Challan[] = [
  {
    id: 1,
    violation_id: 1,
    challan_number: 'SP-2026-001',
    fine_amount: 500,
    issued_at: '2026-08-20T08:30:00Z',
    status: 'issued',
    sha256_hash: 'c3f1e24d7b0a5c8f2d6e9b3a7f1e4c8d2b5a9f3e7c1d4b8a2f6e0c4d7b1a5f9',
    violation: DEMO_VIOLATIONS[0],
  },
  {
    id: 2,
    violation_id: 2,
    challan_number: 'SP-2026-002',
    fine_amount: 500,
    issued_at: '2026-08-20T08:00:00Z',
    status: 'paid',
    sha256_hash: 'd4a2f35e8c1b6d0f4a7c2e5b9f3a7d1e5b8c2f6a0d4e7b1f5a9c3e7d0b4f8a2',
    violation: DEMO_VIOLATIONS[1],
  },
  {
    id: 3,
    violation_id: 3,
    challan_number: 'SP-2026-003',
    fine_amount: 1000,
    issued_at: '2026-08-20T07:00:00Z',
    status: 'disputed',
    sha256_hash: 'e5b3a46c9d2e7b1f5c8a3d6b0f4a8e2c6d9b3f7a1e5c0d4b8f2a6e0c3d7b1a5',
    violation: DEMO_VIOLATIONS[2],
  },
  {
    id: 4,
    violation_id: 4,
    challan_number: 'SP-2026-004',
    fine_amount: 500,
    issued_at: '2026-08-19T22:30:00Z',
    status: 'issued',
    sha256_hash: 'f6c4b57a0e3f8c2a6d9b4e7c1f5a9d3e7b0c4f8a2d6e0b4f7c1a5e9d2b6f0a4',
    violation: DEMO_VIOLATIONS[3],
  },
  {
    id: 5,
    violation_id: 6,
    challan_number: 'SP-2026-005',
    fine_amount: 750,
    issued_at: '2026-08-19T15:45:00Z',
    status: 'paid',
    sha256_hash: 'a7d5c68b1f4a9d3e7c0b5f8a2e6c0d4b8f1a5d9e3b7c1f5a0e4b8d2f6a1c5e9',
    violation: DEMO_VIOLATIONS[5],
  },
  {
    id: 6,
    violation_id: 7,
    challan_number: 'SP-2026-006',
    fine_amount: 500,
    issued_at: '2026-08-19T11:30:00Z',
    status: 'issued',
    sha256_hash: 'b8e6d79c2a5b0e4f8c1d6b9f3a7c2e6d0b4f8a3c7e1d5b9f2a6e0c4d8b2f6a0',
    violation: DEMO_VIOLATIONS[6],
  },
  {
    id: 7,
    violation_id: 8,
    challan_number: 'SP-2026-007',
    fine_amount: 500,
    issued_at: '2026-08-19T10:00:00Z',
    status: 'disputed',
    sha256_hash: 'c9f7e80d3b6c1f5a9d2e7b0c4f8a2d6e1b5f9a3c7e1d4b8f2a6e0c3d7b1a5f9',
    violation: DEMO_VIOLATIONS[7],
  },
  {
    id: 8,
    violation_id: 5,
    challan_number: 'SP-2026-008',
    fine_amount: 250,
    issued_at: '2026-08-19T19:15:00Z',
    status: 'paid',
    sha256_hash: 'd0a8f91e4c7d2f6b0e3a8c1d5f9b3e7a1c5d9f3b7e0c4d8a2f6e0b3c7f1a5e9',
    violation: DEMO_VIOLATIONS[4],
  },
];

const DEMO_TRACKERS: TrackerEntry[] = [
  { vehicle_id: 101, license_plate: 'NL01C7821', vehicle_type: 'Car',        first_seen: '2026-08-20T07:55:00Z', last_seen: '2026-08-20T08:12:00Z', dwell_seconds: 1020, detections: 12 },
  { vehicle_id: 109, license_plate: 'HR26DL9931', vehicle_type: 'Car',       first_seen: '2026-08-20T08:00:00Z', last_seen: '2026-08-20T08:30:00Z', dwell_seconds: 1800, detections: 22 },
  { vehicle_id: 110, license_plate: 'UP32BT4410', vehicle_type: 'Motorcycle', first_seen: '2026-08-20T08:05:00Z', last_seen: '2026-08-20T08:28:00Z', dwell_seconds: 1380, detections: 16 },
  { vehicle_id: 111, license_plate: 'AP07CD1122', vehicle_type: 'Auto',      first_seen: '2026-08-20T08:10:00Z', last_seen: '2026-08-20T08:35:00Z', dwell_seconds: 1500, detections: 18 },
];

const DEMO_CAMERAS: Camera[] = [
  { id: 1, name: 'CAM-A1', location: 'Main Entrance – Gate 1',    status: 'active',   zone_name: 'Zone A', vehicle_count: 14, violation_count_today: 3 },
  { id: 2, name: 'CAM-B2', location: 'Staff Parking – North Bay', status: 'active',   zone_name: 'Zone B', vehicle_count: 7,  violation_count_today: 1 },
  { id: 3, name: 'CAM-C3', location: 'Visitor Bay – East Wing',   status: 'degraded', zone_name: 'Zone C', vehicle_count: 9,  violation_count_today: 2 },
  { id: 4, name: 'CAM-D4', location: 'Loading Dock – Rear',       status: 'offline',  zone_name: 'Zone D', vehicle_count: 0,  violation_count_today: 0 },
];

const DEMO_ANALYTICS: Analytics = {
  daily: [
    { date: '2026-08-14', violations: 18 },
    { date: '2026-08-15', violations: 22 },
    { date: '2026-08-16', violations: 14 },
    { date: '2026-08-17', violations: 31 },
    { date: '2026-08-18', violations: 27 },
    { date: '2026-08-19', violations: 35 },
    { date: '2026-08-20', violations: 12 },
  ],
  zones: [
    { zone: 'Zone A',  violations: 48 },
    { zone: 'Zone B',  violations: 33 },
    { zone: 'Zone C',  violations: 27 },
    { zone: 'Zone D',  violations: 15 },
    { zone: 'Zone E',  violations: 9  },
  ],
  vehicleTypes: [
    { type: 'Car',        count: 85 },
    { type: 'Motorcycle', count: 42 },
    { type: 'Truck',      count: 18 },
    { type: 'Van',        count: 13 },
    { type: 'Bus',        count: 9  },
    { type: 'Auto',       count: 21 },
  ],
};

// ─── API Functions ────────────────────────────────────────────────────────────

export async function getStats(): Promise<SystemStats> {
  if (!API_BASE) return DEMO_STATS;
  try {
    return await apiFetch<SystemStats>('/api/stats');
  } catch {
    return DEMO_STATS;
  }
}

export async function getViolations(): Promise<Violation[]> {
  if (!API_BASE) return DEMO_VIOLATIONS;
  try {
    return await apiFetch<Violation[]>('/api/violations');
  } catch {
    return DEMO_VIOLATIONS;
  }
}

export async function getViolation(id: number): Promise<Violation | null> {
  if (!API_BASE) return DEMO_VIOLATIONS.find((v) => v.id === id) ?? null;
  try {
    return await apiFetch<Violation>(`/api/violations/${id}`);
  } catch {
    return DEMO_VIOLATIONS.find((v) => v.id === id) ?? null;
  }
}

export async function getChallans(): Promise<Challan[]> {
  if (!API_BASE) return DEMO_CHALLANS;
  try {
    return await apiFetch<Challan[]>('/api/challans');
  } catch {
    return DEMO_CHALLANS;
  }
}

export async function getChallan(id: number): Promise<Challan | null> {
  if (!API_BASE) return DEMO_CHALLANS.find((c) => c.id === id) ?? null;
  try {
    return await apiFetch<Challan>(`/api/challans/${id}`);
  } catch {
    return DEMO_CHALLANS.find((c) => c.id === id) ?? null;
  }
}

export async function generateChallan(payload: ChallanGenerateRequest): Promise<Challan> {
  if (!API_BASE) {
    const demo: Challan = {
      id: Math.floor(Math.random() * 9000) + 1000,
      violation_id: 999,
      challan_number: `SP-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      fine_amount: 500,
      issued_at: new Date().toISOString(),
      status: 'issued',
      sha256_hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    };
    return demo;
  }
  return apiFetch<Challan>('/api/challans/generate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateChallanStatus(id: number, status: 'paid' | 'disputed'): Promise<Challan> {
  if (!API_BASE) {
    const challan = DEMO_CHALLANS.find((c) => c.id === id);
    if (!challan) throw new Error('Challan not found');
    return { ...challan, status };
  }
  return apiFetch<Challan>(`/api/challans/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function getActiveTrackers(): Promise<TrackerEntry[]> {
  if (!API_BASE) return DEMO_TRACKERS;
  try {
    return await apiFetch<TrackerEntry[]>('/api/trackers/active');
  } catch {
    return DEMO_TRACKERS;
  }
}

export async function getCameras(): Promise<Camera[]> {
  if (!API_BASE) return DEMO_CAMERAS;
  try {
    return await apiFetch<Camera[]>('/api/cameras');
  } catch {
    return DEMO_CAMERAS;
  }
}

export async function getAnalytics(): Promise<Analytics> {
  if (!API_BASE) return DEMO_ANALYTICS;
  try {
    return await apiFetch<Analytics>('/api/analytics');
  } catch {
    return DEMO_ANALYTICS;
  }
}

export async function uploadEvidence(file: File): Promise<UploadDetectionResult> {
  if (!API_BASE) {
    // Simulate detection result
    const result: UploadDetectionResult = {
      plate: 'MH12DE6671',
      confidence: 0.94,
      vehicle_type: 'Car',
      bbox: [120, 80, 380, 160],
      dwell_minutes: 8.5,
    };
    return result;
  }
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
  return res.json() as Promise<UploadDetectionResult>;
}

export async function verifyEvidence(violationId: number) {
  return {
    valid: true,
    stored_hash: '8d757e4b98eb3b5b53c7ddcf9e2dc4102cb9f3fc24bdecaa38310020ab44d362',
    computed_hash: '8d757e4b98eb3b5b53c7ddcf9e2dc4102cb9f3fc24bdecaa38310020ab44d362',
    match: true,
  };
}
