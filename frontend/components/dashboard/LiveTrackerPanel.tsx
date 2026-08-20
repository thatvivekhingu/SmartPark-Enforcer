"use client";

import { Radar, CircleAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDwell } from "@/lib/utils";
import type { TrackerEntry } from "@/types";
import { DWELL_LIMIT_SECONDS } from "@/lib/constants";

interface LiveTrackerPanelProps {
  trackers: TrackerEntry[];
  loading?: boolean;
}

export default function LiveTrackerPanel({
  trackers,
  loading = false,
}: LiveTrackerPanelProps) {
  if (loading) {
    return (
      <div className="rounded-card border border-border bg-app-card shadow-card p-5 space-y-3">
        <Skeleton className="h-4 w-28" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-card border border-border bg-app-card shadow-card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Radar className="h-4 w-4 text-text-muted" strokeWidth={1.5} />
          <span className="text-sm font-semibold text-text-primary">
            Live Tracker
          </span>
        </div>
        {trackers.length > 0 && (
          <span className="rounded-chip bg-app-elevated px-2 py-0.5 text-[10px] font-medium text-text-muted">
            {trackers.length}
          </span>
        )}
      </div>

      <div className="p-4">
        {trackers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Radar className="h-5 w-5 text-text-muted" strokeWidth={1.5} />
            <span className="text-xs text-text-secondary">
              No active trackers
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            {trackers.map((t) => {
              const pct = Math.min(
                (t.dwell_seconds / DWELL_LIMIT_SECONDS) * 100,
                100
              );
              const isWarning = t.dwell_seconds >= DWELL_LIMIT_SECONDS * 0.75;
              const isDanger = t.dwell_seconds >= DWELL_LIMIT_SECONDS;

              return (
                <div
                  key={t.vehicle_id}
                  className="rounded-badge border border-border bg-app-bg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium text-text-primary">
                        {t.license_plate || t.vehicle_id}
                      </span>
                      <span className="text-[10px] text-text-muted capitalize">
                        {t.vehicle_type}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-text-secondary">
                      {formatDwell(t.dwell_seconds)}
                    </span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-app-elevated overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: isDanger
                          ? "#FF453A"
                          : isWarning
                          ? "#FF9F0A"
                          : "#0A84FF",
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-text-muted">
                    <span>{t.detections} detections</span>
                    {isDanger && (
                      <span className="flex items-center gap-1 text-accent-danger">
                        <CircleAlert className="h-3 w-3" strokeWidth={1.5} />
                        Violation
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
