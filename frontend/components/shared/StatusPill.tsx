"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type StatusValue =
  | "CONFIRMED"
  | "PENDING"
  | "DISMISSED"
  | "issued"
  | "ISSUED"
  | "paid"
  | "PAID"
  | "disputed"
  | "DISPUTED"
  | "active"
  | "ACTIVE"
  | "offline"
  | "OFFLINE"
  | string;

interface StatusPillProps {
  status: StatusValue;
  className?: string;
}

interface StatusConfig {
  label: string;
  dot: string;
  bg: string;
  text: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  CONFIRMED: {
    label: "Confirmed",
    dot: "bg-[#ff3b30]",
    bg: "bg-[#ff3b30]/10",
    text: "text-[#c72820]",
  },
  PENDING: {
    label: "Pending",
    dot: "bg-[#ff9500]",
    bg: "bg-[#ff9500]/10",
    text: "text-[#b26a00]",
  },
  DISMISSED: {
    label: "Dismissed",
    dot: "bg-[#86868b]",
    bg: "bg-black/[0.05]",
    text: "text-[#6e6e73]",
  },
  issued: {
    label: "Issued",
    dot: "bg-[#0071e3]",
    bg: "bg-[#0071e3]/10",
    text: "#0071e3",
  },
  ISSUED: {
    label: "Issued",
    dot: "bg-[#0071e3]",
    bg: "bg-[#0071e3]/10",
    text: "text-[#0071e3]",
  },
  paid: {
    label: "Paid",
    dot: "bg-[#34c759]",
    bg: "bg-[#34c759]/10",
    text: "text-[#1e7e34]",
  },
  PAID: {
    label: "Paid",
    dot: "bg-[#34c759]",
    bg: "bg-[#34c759]/10",
    text: "text-[#1e7e34]",
  },
  disputed: {
    label: "Disputed",
    dot: "bg-[#ff9500]",
    bg: "bg-[#ff9500]/10",
    text: "text-[#b26a00]",
  },
  active: {
    label: "Active",
    dot: "bg-[#34c759]",
    bg: "bg-[#34c759]/10",
    text: "text-[#1e7e34]",
  },
  offline: {
    label: "Offline",
    dot: "bg-[#86868b]",
    bg: "bg-black/[0.05]",
    text: "text-[#6e6e73]",
  },
};

const FALLBACK_CONFIG: StatusConfig = {
  label: "",
  dot: "bg-[#86868b]",
  bg: "bg-black/[0.05]",
  text: "text-[#6e6e73]",
};

export function StatusPill({ status, className }: StatusPillProps) {
  const key = (status || "").toString();
  const cfg = STATUS_MAP[key] || STATUS_MAP[key.toUpperCase()] || { ...FALLBACK_CONFIG, label: key };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-tight shadow-2xs whitespace-nowrap",
        cfg.bg,
        cfg.text,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
      {cfg.label || status}
    </span>
  );
}

export default StatusPill;
