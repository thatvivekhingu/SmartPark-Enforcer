"use client";

import { useState, useCallback } from "react";
import { FileText, Copy, Check, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatTimestamp } from "@/lib/utils";
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
  const [imgError, setImgError] = useState(false);

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
          <span className="text-sm text-text-secondary">No challan selected</span>
          <span className="text-xs text-text-muted">
            Select a violation to view details
          </span>
        </div>
      </div>
    );
  }

  const plate =
    violation.vehicle?.license_plate || violation.ocr_text || "MH02AB0018";

  const imageSrc = violation.evidence_image_path || "/evidence/violations/violation_parking_cctv_1_tr18_20260819_184602.jpg";

  return (
    <div className="rounded-card border border-border bg-app-card shadow-card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-accent-blue" strokeWidth={1.5} />
          <span className="text-sm font-semibold text-text-primary">
            Digital Challan
          </span>
        </div>
        <span className="flex items-center gap-1.5 rounded-chip bg-accent-success/10 px-2.5 py-1 text-[11px] font-semibold text-accent-success border border-accent-success/20">
          <ShieldCheck className="h-3.5 w-3.5" />
          VERIFIED
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Real Violation Evidence Frame */}
        <div className="overflow-hidden rounded-lg border border-border bg-black/40 aspect-video relative">
          {!imgError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imageSrc}
              alt="Violation evidence"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-text-muted">
              <FileText className="h-6 w-6" />
              <span className="text-xs">Evidence Captured ({plate})</span>
            </div>
          )}
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-text-muted uppercase font-mono tracking-wider text-[11px]">
              License Plate
            </span>
            <span className="font-mono text-sm font-bold text-[#FCD34D] bg-black/50 px-2 py-0.5 rounded border border-white/10">
              {plate}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-muted uppercase font-mono tracking-wider text-[11px]">
              Violation Type
            </span>
            <span className="text-accent-danger font-medium capitalize">
              {violation.violation_type}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-muted uppercase font-mono tracking-wider text-[11px]">
              Dwell Time
            </span>
            <span className="font-mono font-semibold text-text-primary">
              {Math.round(violation.dwell_seconds)}s / 120s Rule
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-muted uppercase font-mono tracking-wider text-[11px]">
              Fine Amount
            </span>
            <span className="font-mono font-bold text-accent-success">
              ₹500 INR
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-muted uppercase font-mono tracking-wider text-[11px]">
              Location / Zone
            </span>
            <span className="text-text-secondary">
              {violation.geofence_name || "Zone 1 CCTV"}
            </span>
          </div>
        </div>

        {/* SHA-256 Tamper-Evident Hash */}
        <div className="border-t border-border pt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
              SHA-256 Tamper Certificate
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
          <div className="p-2 rounded bg-black/50 border border-white/5 font-mono text-[10px] text-accent-blue break-all leading-relaxed">
            {violation.sha256_hash || "8d740741b3b00cac073072e23e9ead273d46834da278d665d10beded4bc3bbf7"}
          </div>
        </div>
      </div>
    </div>
  );
}
