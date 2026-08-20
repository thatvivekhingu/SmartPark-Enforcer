"use client";

import { useState } from "react";
import { Monitor, Maximize2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { STREAM_URL } from "@/lib/constants";

interface LiveVideoPanelProps {
  connected: boolean;
  detectionInfo?: {
    vehicleId: string;
    plate: string;
    dwell: number;
    type: string;
  } | null;
}

export default function LiveVideoPanel({
  connected,
  detectionInfo,
}: LiveVideoPanelProps) {
  const [videoError, setVideoError] = useState(false);

  return (
    <div className="rounded-card border border-border bg-app-card shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-text-muted" strokeWidth={1.5} />
          <span className="text-sm font-semibold text-text-primary">
            Live Feed
          </span>
          {!connected && (
            <span className="rounded-chip bg-accent-warning/10 px-2 py-0.5 text-[10px] font-medium text-accent-warning">
              OFFLINE
            </span>
          )}
        </div>
        <button
          className="rounded-badge p-1.5 text-text-muted transition-colors hover:text-text-primary hover:bg-app-elevated"
          aria-label="Fullscreen"
        >
          <Maximize2 className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="relative aspect-video bg-app-bg">
        {!connected || videoError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="skeleton-shimmer h-full w-full" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <AlertCircle
                className="h-6 w-6 text-text-muted"
                strokeWidth={1.5}
              />
              <span className="text-xs text-text-muted">
                {videoError ? "Stream unavailable" : "Connecting to camera..."}
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={STREAM_URL}
              alt="Live camera feed"
              className="h-full w-full object-cover"
              onError={() => setVideoError(true)}
            />
            {detectionInfo && (
              <div className="absolute bottom-3 left-3 rounded-badge bg-app-bg/80 backdrop-blur-sm px-3 py-1.5 border border-border">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-text-primary font-medium">
                    {detectionInfo.plate !== "UNKNOWN"
                      ? detectionInfo.plate
                      : detectionInfo.vehicleId}
                  </span>
                  <span className="text-text-muted">·</span>
                  <span className="text-text-secondary capitalize">
                    {detectionInfo.type}
                  </span>
                  {detectionInfo.dwell > 0 && (
                    <>
                      <span className="text-text-muted">·</span>
                      <span className="text-text-secondary">
                        {Math.round(detectionInfo.dwell)}s
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
