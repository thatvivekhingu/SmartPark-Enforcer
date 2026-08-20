"use client";

import { useState, useCallback } from "react";
import { FileText, Copy, Check, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatTimestamp, formatCurrency, formatHash } from "@/lib/utils";
import { API_BASE } from "@/lib/constants";
import type { Violation } from "@/types";

interface DigitalChallanCardProps {
  violation: Violation | null;
  loading?: boolean;
}

export default function DigitalChallanCard({
  violation,
  loading = false,
}: DigitalChallanCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!violation?.sha256_hash) return;
    navigator.clipboard.writeText(violation.sha256_hash).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [violation]);

  if (loading) {
    return (
      <div className="rounded-card border border-border bg-app-card shadow-card p-5 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    );
  }

  if (!violation) {
    return (
      <div className="rounded-card border border-border bg-app-card shadow-card">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          <FileText className="h-4 w-4 text-text-muted" strokeWidth={1.5} />
          <span className="text-sm font-semibold text-text-primary">
            Digital Challan
          </span>
        </div>
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <FileText className="h-6 w-6 text-text-muted" strokeWidth={1.5} />
          <span className="text-sm text-text-secondary">No challan issued</span>
          <span className="text-xs text-text-muted">
            Select a violation to view details
          </span>
        </div>
      </div>
    );
  }

  const plate =
    violation.vehicle?.license_plate || violation.ocr_text || "UNKNOWN";

  return (
    <div className="rounded-card border border-border bg-app-card shadow-card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-text-muted" strokeWidth={1.5} />
          <span className="text-sm font-semibold text-text-primary">
            Digital Challan
          </span>
        </div>
        <Badge variant={violation.status === "paid" ? "success" : "info"}>
          {violation.status}
        </Badge>
      </div>

      <div className="p-5 space-y-4">
        {violation.evidence_image_path && (
          <div className="overflow-hidden rounded-badge border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${API_BASE}/evidence/image/${violation.id}`}
              alt="Violation evidence"
              className="w-full object-cover"
            />
          </div>
        )}

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text-muted uppercase tracking-wider">
              Plate
            </span>
            <span className="font-mono text-xs font-medium text-text-primary">
              {plate}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text-muted uppercase tracking-wider">
              Violation
            </span>
            <span className="text-xs text-text-secondary capitalize">
              {violation.violation_type}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text-muted uppercase tracking-wider">
              Time
            </span>
            <span className="font-mono text-xs text-text-secondary">
              {formatTimestamp(violation.timestamp)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text-muted uppercase tracking-wider">
              Dwell
            </span>
            <span className="font-mono text-xs text-text-secondary">
              {Math.round(violation.dwell_seconds)}s
            </span>
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-text-muted uppercase tracking-wider">
              SHA-256
            </span>
            <button
              onClick={handleCopy}
              className="rounded-badge p-1 text-text-muted transition-colors hover:text-text-primary hover:bg-app-elevated"
              aria-label="Copy hash"
            >
              {copied ? (
                <Check className="h-3 w-3 text-accent-success" strokeWidth={1.5} />
              ) : (
                <Copy className="h-3 w-3" strokeWidth={1.5} />
              )}
            </button>
          </div>
          <span className="font-mono text-[10px] text-text-muted break-all leading-relaxed">
            {violation.sha256_hash || "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
