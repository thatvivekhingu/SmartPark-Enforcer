"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, ShieldCheck } from "lucide-react";
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
    <span className="font-mono text-xs tabular font-semibold text-[#6e6e73] select-none bg-black/[0.03] px-2.5 py-1 rounded-full border border-black/[0.06]">
      {time || "──:──:──"}
    </span>
  );
}

function SystemStatusPill() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34c759]/10 border border-[#34c759]/20 shadow-2xs">
      <span className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse shrink-0" />
      <span className="text-[11px] font-semibold text-[#1e7e34] whitespace-nowrap">
        All Systems Normal
      </span>
    </div>
  );
}

function NotificationBell({ unread = 3 }: { unread?: number }) {
  return (
    <button
      className="relative p-2 rounded-full text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.05] transition-all"
      title={`${unread} unread notifications`}
    >
      <Bell size={17} strokeWidth={2} />
      {unread > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff3b30] border-2 border-white" />
      )}
    </button>
  );
}

export function Topbar({ title, breadcrumbs }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-[60px] px-6 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] shrink-0">
      {/* Left: Title + Breadcrumbs */}
      <div className="flex flex-col justify-center min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 mb-0.5" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-[#86868b] text-xs">/</span>}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className={cn(
                      "text-xs transition-colors duration-150",
                      i === breadcrumbs.length - 1
                        ? "text-[#1d1d1f] font-semibold"
                        : "text-[#86868b] hover:text-[#1d1d1f]"
                    )}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "text-xs",
                      i === breadcrumbs.length - 1
                        ? "text-[#1d1d1f] font-semibold"
                        : "text-[#86868b]"
                    )}
                  >
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-base font-semibold text-[#1d1d1f] tracking-tight leading-none truncate">
          {title}
        </h1>
      </div>

      {/* Right: Clock + Status + Bell */}
      <div className="flex items-center gap-3 shrink-0 ml-4">
        <LiveClock />
        <div className="w-px h-4 bg-black/[0.08]" />
        <SystemStatusPill />
        <NotificationBell unread={3} />
      </div>
    </header>
  );
}

export default Topbar;
