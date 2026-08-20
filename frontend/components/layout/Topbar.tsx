'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Breadcrumb } from '@/types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface TopbarProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
}

// ─── Live Clock ───────────────────────────────────────────────────────────────

function LiveClock() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-sm tabular text-text-secondary select-none">
      {time || '──:──:──'}
    </span>
  );
}

// ─── System Status Pill ───────────────────────────────────────────────────────

function SystemStatusPill() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/20">
      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-soft shrink-0" />
      <span className="text-[11px] font-medium text-success whitespace-nowrap">
        All systems operational
      </span>
    </div>
  );
}

// ─── Notification Bell ────────────────────────────────────────────────────────

function NotificationBell({ unread = 3 }: { unread?: number }) {
  return (
    <button
      className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-all duration-150"
      title={`${unread} unread notifications`}
      aria-label={`Notifications – ${unread} unread`}
    >
      <Bell size={17} strokeWidth={2} />
      {unread > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger border-2 border-surface" />
      )}
    </button>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

export function Topbar({ title, breadcrumbs }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-[60px] px-6 bg-[#0A0B0E]/80 backdrop-blur-md border-b border-white/[0.07] shrink-0">
      {/* ── Left: Title + Breadcrumbs ── */}
      <div className="flex flex-col justify-center min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 mb-0.5" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && (
                  <span className="text-text-muted text-xs">/</span>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className={cn(
                      'text-xs transition-colors duration-150',
                      i === breadcrumbs.length - 1
                        ? 'text-text-secondary font-medium'
                        : 'text-text-muted hover:text-text-secondary'
                    )}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      'text-xs',
                      i === breadcrumbs.length - 1
                        ? 'text-text-secondary font-medium'
                        : 'text-text-muted'
                    )}
                  >
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-lg font-bold text-text-primary tracking-tight leading-none truncate">
          {title}
        </h1>
      </div>

      {/* ── Right: Clock + Status + Bell ── */}
      <div className="flex items-center gap-3 shrink-0 ml-4">
        <LiveClock />
        <div className="w-px h-4 bg-white/[0.07]" />
        <SystemStatusPill />
        <NotificationBell unread={3} />
      </div>
    </header>
  );
}
