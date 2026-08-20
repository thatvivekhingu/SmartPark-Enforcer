import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export type StatusValue =
  | 'CONFIRMED'
  | 'PENDING'
  | 'DISMISSED'
  | 'issued'
  | 'paid'
  | 'disputed'
  | 'active'
  | 'offline'
  | 'degraded'
  | string;

interface StatusPillProps {
  status: StatusValue;
  className?: string;
}

// ─── Status Config ────────────────────────────────────────────────────────────

interface StatusConfig {
  label: string;
  dot: string;
  bg: string;
  text: string;
  border: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  CONFIRMED: {
    label: 'Confirmed',
    dot: 'bg-danger',
    bg: 'bg-danger/10',
    text: 'text-danger',
    border: 'border-danger/20',
  },
  PENDING: {
    label: 'Pending',
    dot: 'bg-warning',
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning/20',
  },
  DISMISSED: {
    label: 'Dismissed',
    dot: 'bg-text-muted',
    bg: 'bg-white/[0.04]',
    text: 'text-text-muted',
    border: 'border-white/[0.07]',
  },
  issued: {
    label: 'Issued',
    dot: 'bg-brand',
    bg: 'bg-brand/10',
    text: 'text-brand',
    border: 'border-brand/20',
  },
  paid: {
    label: 'Paid',
    dot: 'bg-success',
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success/20',
  },
  disputed: {
    label: 'Disputed',
    dot: 'bg-warning animate-pulse-soft',
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning/20',
  },
  active: {
    label: 'Active',
    dot: 'bg-success animate-pulse-soft',
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success/20',
  },
  offline: {
    label: 'Offline',
    dot: 'bg-text-muted',
    bg: 'bg-white/[0.04]',
    text: 'text-text-muted',
    border: 'border-white/[0.07]',
  },
  degraded: {
    label: 'Degraded',
    dot: 'bg-warning animate-pulse-soft',
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning/20',
  },
};

const FALLBACK_CONFIG: StatusConfig = {
  label: '',
  dot: 'bg-text-muted',
  bg: 'bg-white/[0.04]',
  text: 'text-text-secondary',
  border: 'border-white/[0.07]',
};

// ─── StatusPill ───────────────────────────────────────────────────────────────

export function StatusPill({ status, className }: StatusPillProps) {
  const cfg = STATUS_MAP[status] ?? { ...FALLBACK_CONFIG, label: status };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap',
        cfg.bg,
        cfg.text,
        cfg.border,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} />
      {cfg.label || status}
    </span>
  );
}

export default StatusPill;
