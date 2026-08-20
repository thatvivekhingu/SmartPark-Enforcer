"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  badge?: string;
  badgeVariant?: "green" | "yellow" | "red" | "neutral" | string;
  delta?: string;
  deltaType?: "up" | "down" | "neutral" | string;
  accent?: string;
  icon?: React.ReactNode;
  variant?: "cream" | "slate" | "navy" | string;
  loading?: boolean;
}

export function StatCard({
  label,
  value,
  badge,
  badgeVariant = "green",
  delta,
  deltaType = "up",
  accent,
  icon,
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <div className="rounded-2xl p-5 bg-white border border-black/[0.06] shadow-sm animate-pulse space-y-3">
        <div className="h-3 w-24 bg-black/[0.06] rounded" />
        <div className="h-8 w-16 bg-black/[0.1] rounded" />
      </div>
    );
  }

  const displayBadge = badge || (delta ? delta : undefined);

  return (
    <div className="rounded-2xl p-5 bg-white border border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-black/[0.1] transition-all duration-200 flex flex-col justify-between">
      {/* Top Row: Label + Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
          {label}
        </span>

        {displayBadge && (
          <span
            className={cn(
              "px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight",
              (badgeVariant === "green" || deltaType === "up") && "bg-[#34c759]/10 text-[#1e7e34]",
              badgeVariant === "yellow" && "bg-[#ff9500]/10 text-[#b26a00]",
              (badgeVariant === "red" || deltaType === "down") && "bg-[#ff3b30]/10 text-[#c72820]",
              badgeVariant === "neutral" && "bg-black/[0.05] text-[#6e6e73]"
            )}
          >
            {displayBadge}
          </span>
        )}
      </div>

      {/* Bottom Row: Value + Icon */}
      <div className="flex items-baseline justify-between">
        <div className="text-[32px] font-semibold tracking-tight text-[#1d1d1f] leading-none">
          {typeof value === "number" ? value.toLocaleString("en-IN") : value}
        </div>

        {icon && (
          <div className="p-2 rounded-xl bg-black/[0.03] text-[#0071E3]">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
