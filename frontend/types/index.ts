export interface Vehicle {
  id: string;
  license_plate: string;
  vehicle_type: string;
  color: string;
  registered_owner: string;
  created_at: string;
  updated_at: string;
}

export interface Detection {
  id: number;
  vehicle_id: string;
  timestamp: string;
  confidence: number;
  bbox_x: number;
  bbox_y: number;
  bbox_width: number;
  bbox_height: number;
  frame_number: number;
  source: string;
}

export interface Violation {
  id: number;
  vehicle_id: string;
  violation_type: string;
  timestamp: string;
  dwell_seconds: number;
  geofence_name: string;
  evidence_image_path: string;
  evidence_plate_path: string;
  ocr_text: string;
  ocr_confidence: number;
  sha256_hash: string;
  latitude: number;
  longitude: number;
  vehicle?: Vehicle;
  status: string;
}

export interface Challan {
  id: number;
  violation_id: number;
  challan_number: string;
  fine_amount: number;
  issued_at: string;
  status: string;
  sha256_hash: string;
  violation?: Violation;
}

export interface TrackerEntry {
  vehicle_id: string;
  license_plate: string;
  vehicle_type: string;
  first_seen: string;
  last_seen: string;
  dwell_seconds: number;
  detections: number;
}

export interface SystemStats {
  total_vehicles: number;
  active_vehicles: number;
  total_violations: number;
  total_challans: number;
  ocr_available: boolean;
}

export interface SystemStatus {
  yolo: boolean;
  ocr: boolean;
  websocket: boolean;
  backend: boolean;
}

export interface ViolationWsEvent {
  type: "VIOLATION_CREATED" | "DETECTION" | "STATUS_UPDATE";
  data: Record<string, unknown>;
}

export interface EvidenceVerification {
  valid: boolean;
  stored_hash: string;
  computed_hash: string;
  match: boolean;
}
