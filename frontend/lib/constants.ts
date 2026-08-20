export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "";

export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  (typeof window !== "undefined"
    ? `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws`
    : "");

export const STREAM_URL = `${API_BASE}/stream`;

export const DWELL_LIMIT_SECONDS = 120;

export const REFRESH_INTERVAL_MS = 2000;

export const WS_RECONNECT_BASE_MS = 1000;
export const WS_RECONNECT_MAX_MS = 30000;

export const VIOLATION_TYPE_LABELS: Record<string, string> = {
  parking: "Illegal Parking",
  stopping: "No Stopping",
  geofence: "Geofence Violation",
};

export const CHALLAN_STATUS_COLORS: Record<string, string> = {
  pending: "text-accent-warning",
  issued: "text-accent-blue",
  paid: "text-accent-success",
  contested: "text-text-muted",
};
