import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Accent = 'brand' | 'success' | 'warning' | 'danger';
type DeltaType = 'up' | 'down' | 'neutral';

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: DeltaType;
  icon: ReactNode;
  accent?: Accent;
  loading?: boolean;
}

// ─── Accent Config ────────────────────────────────────────────────────────────

const ACCENT_CONFIG: Record<Accent, { iconBg: string; iconText: string; glow: string; border: string }> = {
  brand: {
    iconBg: 'bg-brand/10',
    iconText: 'text-brand',
    glow: 'hover:shadow-glow',
    border: 'hover:border-brand/20',
  },
  success: {
    iconBg: 'bg-success/10',
    iconText: 'text-success',
    glow: 'hover:shadow-glow-success',
    border: 'hover:border-success/20',
  },
  warning: {
    iconBg: 'bg-warning/10',
    iconText: 'text-warning',
    glow: '',
    border: 'hover:border-warning/20',
  },
  danger: {
    iconBg: 'bg-danger/10',
    iconText: 'text-danger',
    glow: 'hover:shadow-glow-danger',
    border: 'hover:border-danger/20',
  },
};

// ─── Delta Indicator ──────────────────────────────────────────────────────────

function DeltaIndicator({ delta, type }: { delta: string; type: DeltaType }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium',
        type === 'up' && 'text-success',
        type === 'down' && 'text-danger',
        type === 'neutral' && 'text-text-muted'
      )}
    >
      {type === 'up' && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
          <path d="M5 2L9 8H1L5 2Z" fill="currentColor" />
        </svg>
      )}
      {type === 'down' && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
          <path d="M5 8L1 2H9L5 8Z" fill="currentColor" />
        </svg>
      )}
      {type === 'neutral' && (
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="shrink-0">
          <rect y="2" width="10" height="2" rx="1" fill="currentColor" />
        </svg>
      )}
      <span>{delta}</span>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="skeleton w-10 h-10 rounded-lg" />
        <div className="skeleton w-16 h-4 rounded" />
      </div>
      <div>
        <div className="skeleton w-24 h-8 rounded mb-2" />
        <div className="skeleton w-32 h-3 rounded" />
      </div>
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

export function StatCard({
  label,
  value,
  delta,
  deltaType = 'neutral',
  icon,
  accent = 'brand',
  loading = false,
}: StatCardProps) {
  if (loading) return <StatCardSkeleton />;

  const cfg = ACCENT_CONFIG[accent];

  return (
    <div
      className={cn(
        'card p-5 flex flex-col gap-4 transition-all duration-200 cursor-default',
        cfg.glow,
        cfg.border
      )}
    >
      {/* Top row: icon + optional delta */}
      <div className="flex items-start justify-between">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', cfg.iconBg)}>
          <span className={cn('w-5 h-5 flex items-center justify-center', cfg.iconText)}>
            {icon}
          </span>
        </div>
        {delta && <DeltaIndicator delta={delta} type={deltaType} />}
      </div>

      {/* Bottom: value + label */}
      <div>
        <div className="stat-number mb-1">
          {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
        </div>
        <div className="text-sm text-text-secondary leading-tight">{label}</div>
      </div>
    </div>
  );
}

export default StatCard;
