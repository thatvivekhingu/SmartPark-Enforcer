"use client";

import { useState, useRef, useEffect } from "react";
import { Monitor, Maximize2, Shield, Video, PlayCircle, Radio, Play, Pause, RefreshCw } from "lucide-react";
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
  const [feedMode, setFeedMode] = useState<"ai_video" | "mjpeg">("ai_video");
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && feedMode === "ai_video") {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [feedMode]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const restartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="rounded-card border border-border bg-app-card shadow-card overflow-hidden">
      {/* Header with Camera Status & Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-border bg-black/20">
        <div className="flex items-center gap-2.5">
          <Monitor className="h-4 w-4 text-accent-blue" strokeWidth={1.8} />
          <span className="text-sm font-semibold text-text-primary">
            CCTV Feed · CAM-01 (YouTube Surveillance)
          </span>
          <span className="rounded-chip bg-accent-success/10 px-2 py-0.5 text-[10px] font-medium text-accent-success flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-success animate-pulse" />
            AI ACTIVE
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-badge bg-[#18181b] p-1 border border-border">
            <button
              onClick={() => setFeedMode("ai_video")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                feedMode === "ai_video"
                  ? "bg-accent-blue text-white shadow-sm font-semibold"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <PlayCircle className="h-3 w-3" />
              AI Detected Video
            </button>
            <button
              onClick={() => setFeedMode("mjpeg")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                feedMode === "mjpeg"
                  ? "bg-accent-blue text-white shadow-sm font-semibold"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <Radio className="h-3 w-3" />
              Live MJPEG Stream
            </button>
          </div>

          <button
            className="rounded-badge p-1.5 text-text-muted transition-colors hover:text-text-primary hover:bg-app-elevated"
            aria-label="Fullscreen"
            onClick={() => {
              if (videoRef.current) {
                if (videoRef.current.requestFullscreen) {
                  videoRef.current.requestFullscreen();
                }
              }
            }}
          >
            <Maximize2 className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative aspect-video bg-[#08080a] overflow-hidden group">
        {feedMode === "ai_video" ? (
          /* Web-Optimized H.264 MP4 with AutoPlay & Controls */
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src="/videos/annotated_output.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              controls={true}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
            />

            {/* Quick Play/Pause & Restart Overlay on Hover */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 backdrop-blur-md p-1 rounded-badge border border-white/10">
              <button
                onClick={togglePlay}
                className="p-1.5 rounded hover:bg-white/10 text-white transition-colors"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={restartVideo}
                className="p-1.5 rounded hover:bg-white/10 text-white transition-colors"
                title="Restart Video"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Top Right Live AI Indicator */}
            <div className="absolute top-3 right-3 rounded-badge bg-black/80 backdrop-blur-md px-2.5 py-1 border border-white/10 flex items-center gap-2 text-[11px] font-mono pointer-events-none">
              <span className="h-2 w-2 rounded-full bg-accent-danger animate-ping" />
              <span className="text-white font-semibold">YOLO11 + ByteTrack Active</span>
            </div>
          </div>
        ) : (
          /* Live Stream Endpoint (localhost:8000/api/stream or fallback) */
          <div className="relative w-full h-full">
            {!videoError ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={STREAM_URL}
                alt="Live camera feed"
                className="h-full w-full object-cover"
                onError={() => setVideoError(true)}
              />
            ) : (
              /* High-Tech Surveillance Radar Fallback */
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#111215] to-[#070709]">
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                <div className="absolute inset-[15%] border-2 border-dashed border-accent-warning/60 bg-accent-warning/5 rounded-lg flex items-start justify-between p-3">
                  <span className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-accent-warning uppercase tracking-wider">
                    <Shield className="h-3.5 w-3.5" />
                    No-Parking Geo-Fence Zone (120s Rule)
                  </span>
                  <span className="text-[10px] font-mono text-accent-warning/80">
                    [100,80] → [540,300]
                  </span>
                </div>
                <div className="absolute top-[35%] left-[40%] w-[160px] h-[80px] border-2 border-accent-danger rounded bg-accent-danger/10 flex flex-col justify-between p-1.5 shadow-glow">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-accent-danger">
                    <span>#89 CAR</span>
                    <span>125s</span>
                  </div>
                  <div className="text-[11px] font-mono font-extrabold text-[#FCD34D] text-center bg-black/60 rounded py-0.5">
                    MH05AB0089
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating Detection Badge */}
        {detectionInfo && (
          <div className="absolute bottom-3 left-3 rounded-badge bg-black/80 backdrop-blur-md px-3 py-1.5 border border-white/10 pointer-events-none">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-[#FCD34D] font-bold">
                {detectionInfo.plate !== "UNKNOWN"
                  ? detectionInfo.plate
                  : detectionInfo.vehicleId}
              </span>
              <span className="text-text-muted">·</span>
              <span className="text-text-secondary capitalize font-medium">
                {detectionInfo.type}
              </span>
              {detectionInfo.dwell > 0 && (
                <>
                  <span className="text-text-muted">·</span>
                  <span className="text-accent-danger font-mono font-semibold">
                    {Math.round(detectionInfo.dwell)}s Dwell
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Information Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 border-t border-border bg-app-bg text-[11px] font-mono text-text-muted">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-text-secondary">
            <Video className="h-3.5 w-3.5 text-accent-blue" />
            Model: YOLO11 + ByteTrack
          </span>
          <span>·</span>
          <span>Resolution: 640×360 @ 30 FPS</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-accent-success font-semibold">
            105 Vehicles Tracked
          </span>
          <span>·</span>
          <span className="text-accent-danger font-semibold">
            15 Violations
          </span>
        </div>
      </div>
    </div>
  );
}
