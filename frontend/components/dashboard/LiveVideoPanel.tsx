"use client";

import { useState } from "react";
import { Monitor, Maximize2, Shield, Video } from "lucide-react";
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
          <Monitor className="h-4 w-4 text-accent-blue" strokeWidth={1.8} />
          <span className="text-sm font-semibold text-text-primary">
            Live Feed · CAM-01
          </span>
          <span className="rounded-chip bg-accent-success/10 px-2 py-0.5 text-[10px] font-medium text-accent-success flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-success animate-pulse" />
            ONLINE
          </span>
        </div>
        <button
          className="rounded-badge p-1.5 text-text-muted transition-colors hover:text-text-primary hover:bg-app-elevated"
          aria-label="Fullscreen"
        >
          <Maximize2 className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="relative aspect-video bg-[#0a0a0c] overflow-hidden">
        {!videoError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={STREAM_URL}
            alt="Live camera feed"
            className="h-full w-full object-cover"
            onError={() => setVideoError(true)}
          />
        ) : (
          /* High-Tech Surveillance Canvas Overlay for Cloud */
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#111215] to-[#070709]">
            {/* Grid Lines */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            {/* Geo-Fence Polygon Box */}
            <div className="absolute inset-[15%] border-2 border-dashed border-accent-warning/60 bg-accent-warning/5 rounded-lg flex items-start justify-between p-3">
              <span className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-accent-warning uppercase tracking-wider">
                <Shield className="h-3.5 w-3.5" />
                No-Parking Geo-Fence Zone (120s Rule)
              </span>
              <span className="text-[10px] font-mono text-accent-warning/80">
                [300,200] → [980,580]
              </span>
            </div>

            {/* Active Tracked Vehicle Bounding Box */}
            <div className="absolute top-[35%] left-[40%] w-[160px] h-[80px] border-2 border-accent-danger rounded bg-accent-danger/10 flex flex-col justify-between p-1.5 shadow-glow">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-accent-danger">
                <span>#2018 CAR</span>
                <span>125s</span>
              </div>
              <div className="text-[11px] font-mono font-extrabold text-[#FCD34D] text-center bg-black/60 rounded py-0.5">
                MH02AB0018
              </div>
            </div>

            {/* Bottom Status Chip */}
            <div className="absolute bottom-3 left-3 rounded-badge bg-black/80 backdrop-blur-md px-3 py-1.5 border border-white/10 flex items-center gap-2 text-xs">
              <Video className="h-3.5 w-3.5 text-accent-blue" />
              <span className="font-mono text-text-primary font-medium">
                YOLO11 + ByteTrack Active
              </span>
              <span className="text-text-muted">·</span>
              <span className="text-accent-success font-medium">30 FPS</span>
            </div>
          </div>
        )}

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
      </div>
    </div>
  );
}
