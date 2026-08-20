import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  accent?: boolean;
  loading?: boolean;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = false,
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <div className="rounded-card border border-border bg-app-card p-5 shadow-card">
        <Skeleton className="mb-3 h-4 w-20" />
        <Skeleton className="h-8 w-14" />
      </div>
    );
  }

  return (
    <div className="rounded-card border border-border bg-app-card p-5 shadow-card transition-colors hover:bg-app-elevated">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-text-muted" strokeWidth={1.5} />
        <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
          {label}
        </span>
      </div>
      <div
        className={cn(
          "text-[28px] font-semibold tracking-tight leading-none",
          accent && value > 0 ? "text-accent-danger" : "text-text-primary"
        )}
      >
        {value.toLocaleString()}
      </div>
    </div>
  );
}
