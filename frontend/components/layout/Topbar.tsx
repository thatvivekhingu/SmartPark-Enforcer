"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, ShieldCheck, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Breadcrumb } from "@/types";

interface TopbarProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
}

function LiveClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-xs tabular font-bold text-slate-300 select-none bg-[#1E293B] px-2.5 py-1 rounded border border-[#334155]">
      {time || "──:──:──"} IST
    </span>
  );
}

function SystemStatusPill() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DCFCE7] border border-emerald-300/40 shadow-sm">
      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
      <span className="text-[11px] font-bold text-[#166534] whitespace-nowrap">
        ICCC Gateway Active · Encrypted
      </span>
    </div>
  );
}

function NotificationBell({ unread = 3 }: { unread?: number }) {
  return (
    <button
      className="relative p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-[#1E293B] transition-all border border-[#334155]"
      title={`${unread} active priority alerts`}
    >
      <Bell size={16} strokeWidth={2} />
      {unread > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-[#1E293B]" />
      )}
    </button>
  );
}

export function Topbar({ title, breadcrumbs }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-[64px] px-6 bg-[#0B132B]/95 backdrop-blur-md border-b border-[#334155] shrink-0">
      {/* Left: Official Domain breadcrumb + Title */}
      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-slate-400">
          <Globe className="w-3 h-3 text-slate-400" />
          <span className="text-slate-400">https://dashboard.municipalpolice.gov.in</span>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <>
              <span>/</span>
              <span className="text-amber-400 font-semibold">{breadcrumbs[0].label.toLowerCase()}</span>
            </>
          )}
        </div>
        <h1 className="text-lg font-black text-slate-100 uppercase tracking-tight leading-none truncate font-sans">
          {title}
        </h1>
      </div>

      {/* Right: Clock + Status + Notification Bell */}
      <div className="flex items-center gap-3 shrink-0 ml-4">
        <LiveClock />
        <SystemStatusPill />
        <NotificationBell unread={3} />
      </div>
    </header>
  );
}

export default Topbar;
