"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  badge?: string;
  badgeVariant?: "green" | "yellow" | "red" | "neutral";
  delta?: string;
  deltaType?: "up" | "down" | "neutral" | string;
  accent?: string;
  icon?: React.ReactNode;
  variant?: "cream" | "slate" | "navy";
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
  variant = "cream",
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <div className="rounded-xl p-5 bg-[#F5EBE0] border border-[#E2E8F0] shadow-sm animate-pulse space-y-2">
        <div className="h-3 w-20 bg-slate-300 rounded" />
        <div className="h-8 w-16 bg-slate-400 rounded" />
      </div>
    );
  }

  // Variant Styling (Cream/Light Beige vs Navy)
  const isCream = variant === "cream";
  const displayBadge = badge || (delta ? delta : undefined);

  return (
    <div
      className={cn(
        "rounded-xl p-5 flex flex-col justify-between transition-all duration-150 border shadow-sm",
        isCream
          ? "bg-[#F5EBE0] text-[#0F172A] border-[#E2D4C3] hover:border-[#D5C2AD]"
          : "bg-[#1E293B] text-slate-100 border-[#334155] hover:border-slate-500"
      )}
    >
      {/* Top Row: Label + Optional Badge / Icon */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span
          className={cn(
            "text-[11px] font-black uppercase tracking-wider leading-none",
            isCream ? "text-[#475569]" : "text-slate-400"
          )}
        >
          {label}
        </span>

        {displayBadge && (
          <span
            className={cn(
              "px-2 py-0.5 rounded-md text-[10px] font-bold tracking-tight shadow-2xs uppercase",
              badgeVariant === "green" && "bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]",
              badgeVariant === "yellow" && "bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]",
              badgeVariant === "red" && "bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]",
              badgeVariant === "neutral" && "bg-[#E2E8F0] text-[#475569] border border-[#CBD5E1]"
            )}
          >
            {displayBadge}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline justify-between">
        <div
          className={cn(
            "text-[30px] font-black tracking-tight leading-none font-sans",
            isCream ? "text-[#0F172A]" : "text-slate-100"
          )}
        >
          {typeof value === "number" ? value.toLocaleString("en-IN") : value}
        </div>

        {icon && (
          <div className={cn("p-1.5 rounded-lg", isCream ? "text-slate-600" : "text-slate-400")}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
