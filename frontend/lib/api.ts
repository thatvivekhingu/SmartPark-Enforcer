import { API_BASE } from "./constants";
import type { SystemStats, Violation, Challan, TrackerEntry, EvidenceVerification } from "@/types";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function getStats(): Promise<SystemStats> {
  return fetchJson<SystemStats>("/api/stats");
}

export async function getViolations(): Promise<Violation[]> {
  const data = await fetchJson<{ violations: Violation[] } | Violation[]>(
    "/api/violations"
  );
  return Array.isArray(data) ? data : data.violations || [];
}

export async function getChallans(): Promise<Challan[]> {
  const data = await fetchJson<{ challans: Challan[] } | Challan[]>(
    "/api/challans"
  );
  return Array.isArray(data) ? data : data.challans || [];
}

export async function getActiveTrackers(): Promise<TrackerEntry[]> {
  const data = await fetchJson<{ trackers: TrackerEntry[] } | TrackerEntry[]>(
    "/api/active-trackers"
  );
  return Array.isArray(data) ? data : data.trackers || [];
}

export async function verifyEvidence(
  violationId: number
): Promise<EvidenceVerification> {
  return fetchJson<EvidenceVerification>(
    `/api/evidence/${violationId}/verify`
  );
}
