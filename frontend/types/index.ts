// ─── Core System Types ───────────────────────────────────────────────────────

export interface SystemStats {
  total_vehicles: number;
  active_vehicles: number;
  total_violations: number;
  total_challans: number;
  ocr_available: boolean;
}

export interface SystemStatus {
  backend: boolean;
  yolo: boolean;
  ocr: boolean;
  websocket: boolean;
}

// ─── Vehicle ─────────────────────────────────────────────────────────────────

export interface Vehicle {
  id: number;
  license_plate: string;
  vehicle_type: string;
  color: string;
  registered_owner: string;
  created_at: string;
  updated_at: string;
}

// ─── Violation ───────────────────────────────────────────────────────────────

export type ViolationStatus = 'CONFIRMED' | 'PENDING' | 'DISMISSED';

export interface Violation {
  id: number;
  vehicle_id: number;
  violation_type: string;
  timestamp: string;
  dwell_seconds: number;
  geofence_name: string;
  evidence_image_path: string | null;
  evidence_plate_path: string | null;
  ocr_text: string | null;
  ocr_confidence: number | null;
  sha256_hash: string;
  latitude: number | null;
  longitude: number | null;
  status: ViolationStatus;
  vehicle?: Vehicle;
}

export interface EvidenceVerification {
  valid: boolean;
  stored_hash: string;
  computed_hash: string;
  match: boolean;
}

export interface ViolationWsEvent {
  type?: string;
  event?: string;
  data: Record<string, unknown>;
}

export type ChallanStatus = 'issued' | 'paid' | 'disputed';

export interface Challan {
  id: number;
  violation_id: number;
  challan_number: string;
  fine_amount: number;
  issued_at: string;
  status: ChallanStatus;
  sha256_hash: string;
  pdf_url?: string;
  violation?: Violation;
}

// ─── Tracker ─────────────────────────────────────────────────────────────────

export interface TrackerEntry {
  vehicle_id: number;
  license_plate: string;
  vehicle_type: string;
  first_seen: string;
  last_seen: string;
  dwell_seconds: number;
  detections: number;
}

// ─── Camera ──────────────────────────────────────────────────────────────────

export type CameraStatus = 'active' | 'offline' | 'degraded';

export interface Camera {
  id: number;
  name: string;
  location: string;
  status: CameraStatus;
  zone_name: string;
  vehicle_count: number;
  violation_count_today: number;
  thumbnail_url?: string;
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface AnalyticsDay {
  date: string;
  violations: number;
}

export interface ZoneStats {
  zone: string;
  violations: number;
}

export interface VehicleTypeStats {
  type: string;
  count: number;
}

export interface Analytics {
  daily: AnalyticsDay[];
  zones: ZoneStats[];
  vehicleTypes: VehicleTypeStats[];
}

// ─── Upload / Detection ──────────────────────────────────────────────────────

export interface UploadDetectionResult {
  plate: string;
  confidence: number;
  vehicle_type: string;
  bbox: number[];
  annotated_image_b64?: string;
  dwell_minutes: number;
}

// ─── Challan Generation ──────────────────────────────────────────────────────

export interface ChallanGenerateRequest {
  plate: string;
  vehicle_type: string;
  dwell_minutes: number;
  zone: string;
  evidence_image_b64?: string;
  ocr_confidence: number;
}

// ─── API Response Wrappers ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

// ─── UI / Navigation ─────────────────────────────────────────────────────────

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export interface Breadcrumb {
  label: string;
  href?: string;
}
