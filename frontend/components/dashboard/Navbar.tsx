"use client";

import { useState, useEffect } from "react";
import { Shield, Wifi, WifiOff, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SystemStatus } from "@/types";

interface StatusPillProps {
  label: string;
  active: boolean;
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-block h-[6px] w-[6px] rounded-full",
        active ? "bg-accent-success animate-pulse-dot" : "bg-text-muted"
      )}
    />
  );
}

function StatusPill({ label, active }: StatusPillProps) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
      <StatusDot active={active} />
      <span>{label}</span>
    </div>
  );
}

interface NavbarProps {
  status: SystemStatus | null;
  connected: boolean;
}

export default function Navbar({ status, connected }: NavbarProps) {
  const [time, setTime] = useState("00:00:00");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const allOk = status
    ? status.yolo && status.ocr && status.websocket && status.backend
    : false;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-app-bg/80 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-badge bg-app-elevated">
            <Shield className="h-4 w-4 text-text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-sm font-semibold text-text-primary tracking-tight">
              SmartPark
            </div>
            <div className="text-[11px] text-text-muted leading-none">
              Enforcement Dashboard
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 rounded-badge bg-app-elevated px-3 py-1.5 transition-colors hover:bg-[#222225]"
          >
            <StatusDot active={allOk} />
            <span className="text-xs text-text-secondary">
              {allOk ? "All systems operational" : "Issues detected"}
            </span>
          </button>

          {expanded && status && (
            <div className="flex items-center gap-4 rounded-card border border-border bg-app-card p-3 shadow-elevated">
              <StatusPill label="YOLO" active={status.yolo} />
              <StatusPill label="OCR" active={status.ocr} />
              <StatusPill
                label="WebSocket"
                active={connected}
              />
              <StatusPill label="Backend" active={status.backend} />
            </div>
          )}

          <div className="flex items-center gap-1.5 text-text-muted">
            {connected ? (
              <Wifi className="h-3.5 w-3.5" strokeWidth={1.5} />
            ) : (
              <WifiOff className="h-3.5 w-3.5" strokeWidth={1.5} />
            )}
            <span className="font-mono text-xs tracking-wider">{time}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
