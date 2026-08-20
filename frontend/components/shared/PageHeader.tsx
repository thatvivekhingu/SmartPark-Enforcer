import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Breadcrumb } from '@/types';
import type { ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
}

// ─── PageHeader ───────────────────────────────────────────────────────────────

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      {/* Left: breadcrumb + title + description */}
      <div className="min-w-0">
        {/* Breadcrumb */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            className="flex items-center flex-wrap gap-0.5 mb-2"
            aria-label="Breadcrumb"
          >
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <span key={i} className="flex items-center gap-0.5">
                  {i > 0 && (
                    <ChevronRight
                      size={12}
                      className="text-text-muted shrink-0"
                      strokeWidth={2}
                    />
                  )}
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="text-xs text-text-muted hover:text-text-secondary transition-colors duration-150"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      className={cn(
                        'text-xs',
                        isLast ? 'text-text-secondary font-medium' : 'text-text-muted'
                      )}
                    >
                      {crumb.label}
                    </span>
                  )}
                </span>
              );
            })}
          </nav>
        )}

        {/* Title */}
        <h1 className="text-2xl font-bold text-text-primary tracking-tight leading-tight">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="mt-1 text-sm text-text-secondary leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Right: action slot */}
      {actions && (
        <div className="flex items-center gap-2 shrink-0 mt-1">
          {actions}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
