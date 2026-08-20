"use client";

import { useState } from "react";
import { Shield, Check, X, Lock, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatHash } from "@/lib/utils";
import { verifyEvidence } from "@/lib/api";
import type { Violation, EvidenceVerification } from "@/types";

interface EvidenceIntegrityCardProps {
  violation: Violation | null;
  loading?: boolean;
}

export default function EvidenceIntegrityCard({
  violation,
  loading = false,
}: EvidenceIntegrityCardProps) {
  const [verification, setVerification] = useState<EvidenceVerification | null>(
    null
  );
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    if (!violation) return;
    setVerifying(true);
    try {
      const result = await verifyEvidence(violation.id);
      setVerification(result);
    } catch {
      setVerification({
        valid: false,
        stored_hash: "—",
        computed_hash: "—",
        match: false,
      });
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-card border border-border bg-app-card shadow-card p-5 space-y-3">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-32" />
      </div>
    );
  }

  return (
    <div className="rounded-card border border-border bg-app-card shadow-card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-text-muted" strokeWidth={1.5} />
          <span className="text-sm font-semibold text-text-primary">
            Evidence Integrity
          </span>
        </div>
        {violation && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVerify}
            disabled={verifying}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-1 ${verifying ? "animate-spin" : ""}`}
              strokeWidth={1.5}
            />
            Verify
          </Button>
        )}
      </div>

      <div className="p-5">
        {!violation ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Shield className="h-5 w-5 text-text-muted" strokeWidth={1.5} />
            <span className="text-xs text-text-secondary">
              Select a violation to verify
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs">
              <Lock className="h-3.5 w-3.5 text-text-muted" strokeWidth={1.5} />
              <span className="text-text-secondary">Violation #{violation.id}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <span className="text-[11px] text-text-muted uppercase tracking-wider whitespace-nowrap">
                  Stored
                </span>
                <span className="font-mono text-[10px] text-text-muted break-all text-right leading-relaxed">
                  {violation.sha256_hash
                    ? formatHash(violation.sha256_hash)
                    : "—"}
                </span>
              </div>
              {verification && (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[11px] text-text-muted uppercase tracking-wider whitespace-nowrap">
                      Recomputed
                    </span>
                    <span className="font-mono text-[10px] text-text-muted break-all text-right leading-relaxed">
                      {formatHash(verification.computed_hash)}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2.5">
                    <div className="flex items-center gap-2">
                      {verification.match ? (
                        <Check className="h-4 w-4 text-accent-success" strokeWidth={1.5} />
                      ) : (
                        <X className="h-4 w-4 text-accent-danger" strokeWidth={1.5} />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          verification.match
                            ? "text-accent-success"
                            : "text-accent-danger"
                        }`}
                      >
                        {verification.match
                          ? "Integrity verified"
                          : "Hash mismatch — tamper detected"}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
