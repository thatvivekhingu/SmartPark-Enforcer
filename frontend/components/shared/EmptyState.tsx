import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { PackageOpen } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4 text-text-muted">
        {icon ?? <PackageOpen size={24} strokeWidth={1.5} />}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-text-primary mb-1.5">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-text-secondary max-w-sm leading-relaxed mb-5">
        {description}
      </p>

      {/* Optional action */}
      {action && <div>{action}</div>}
    </div>
  );
}

export default EmptyState;
