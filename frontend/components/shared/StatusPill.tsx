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
  border: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  CONFIRMED: {
    label: "Confirmed",
    dot: "bg-[#EF4444]",
    bg: "bg-[#FEE2E2]",
    text: "text-[#991B1B]",
    border: "border-[#FECACA]",
  },
  PENDING: {
    label: "Pending",
    dot: "bg-[#F59E0B]",
    bg: "bg-[#FEF3C7]",
    text: "text-[#92400E]",
    border: "border-[#FDE68A]",
  },
  DISMISSED: {
    label: "Dismissed",
    dot: "bg-[#64748B]",
    bg: "bg-[#F1F5F9]",
    text: "text-[#475569]",
    border: "border-[#E2E8F0]",
  },
  issued: {
    label: "Issued",
    dot: "bg-[#4C6FFF]",
    bg: "bg-[#E0E7FF]",
    text: "text-[#3730A3]",
    border: "border-[#C7D2FE]",
  },
  ISSUED: {
    label: "Issued",
    dot: "bg-[#4C6FFF]",
    bg: "bg-[#E0E7FF]",
    text: "text-[#3730A3]",
    border: "border-[#C7D2FE]",
  },
  paid: {
    label: "Paid",
    dot: "bg-[#22C55E]",
    bg: "bg-[#DCFCE7]",
    text: "text-[#166534]",
    border: "border-[#BBF7D0]",
  },
  PAID: {
    label: "Paid",
    dot: "bg-[#22C55E]",
    bg: "bg-[#DCFCE7]",
    text: "text-[#166534]",
    border: "border-[#BBF7D0]",
  },
  disputed: {
    label: "Disputed",
    dot: "bg-[#F59E0B]",
    bg: "bg-[#FEF3C7]",
    text: "text-[#92400E]",
    border: "border-[#FDE68A]",
  },
  active: {
    label: "Active",
    dot: "bg-[#22C55E]",
    bg: "bg-[#DCFCE7]",
    text: "text-[#166534]",
    border: "border-[#BBF7D0]",
  },
  offline: {
    label: "Offline",
    dot: "bg-[#64748B]",
    bg: "bg-[#F1F5F9]",
    text: "text-[#475569]",
    border: "border-[#E2E8F0]",
  },
};

const FALLBACK_CONFIG: StatusConfig = {
  label: "",
  dot: "bg-slate-400",
  bg: "bg-slate-100",
  text: "text-slate-700",
  border: "border-slate-300",
};

export function StatusPill({ status, className }: StatusPillProps) {
  const key = (status || "").toString();
  const cfg = STATUS_MAP[key] || STATUS_MAP[key.toUpperCase()] || { ...FALLBACK_CONFIG, label: key };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold tracking-tight shadow-sm whitespace-nowrap",
        cfg.bg,
        cfg.text,
        cfg.border,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
      {cfg.label || status}
    </span>
  );
}

export default StatusPill;
