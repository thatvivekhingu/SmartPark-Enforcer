"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Car, Bike, Truck, CircleAlert } from "lucide-react";
import { formatTimestamp, formatDwell } from "@/lib/utils";
import type { Violation } from "@/types";

function vehicleIcon(type: string) {
  const cls = "h-3.5 w-3.5 text-text-muted";
  switch (type?.toLowerCase()) {
    case "car":
      return <Car className={cls} strokeWidth={1.5} />;
    case "motorcycle":
    case "bike":
      return <Bike className={cls} strokeWidth={1.5} />;
    case "truck":
      return <Truck className={cls} strokeWidth={1.5} />;
    default:
      return <Car className={cls} strokeWidth={1.5} />;
  }
}

function statusVariant(status: string) {
  switch (status) {
    case "pending":
      return "warning" as const;
    case "issued":
      return "info" as const;
    case "paid":
      return "success" as const;
    default:
      return "default" as const;
  }
}

interface ViolationsTableProps {
  violations: Violation[];
  loading?: boolean;
  onSelect?: (v: Violation) => void;
}

export default function ViolationsTable({
  violations,
  loading = false,
  onSelect,
}: ViolationsTableProps) {
  if (loading) {
    return (
      <div className="space-y-2 p-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (violations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <CircleAlert className="h-6 w-6 text-text-muted" strokeWidth={1.5} />
        <span className="text-sm text-text-secondary">No violations recorded</span>
        <span className="text-xs text-text-muted">
          Violations will appear here as they are detected
        </span>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          <TableHead>Vehicle</TableHead>
          <TableHead>Plate</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Dwell</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {violations.map((v) => (
          <TableRow
            key={v.id}
            className="cursor-pointer"
            onClick={() => onSelect?.(v)}
          >
            <TableCell>
              <div className="flex items-center gap-2">
                {vehicleIcon(v.vehicle?.vehicle_type || "")}
                <span className="text-xs text-text-secondary capitalize">
                  {v.vehicle?.vehicle_type || "—"}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <span className="font-mono text-xs font-medium text-text-primary bg-app-elevated rounded-chip px-2 py-0.5">
                {v.vehicle?.license_plate || v.ocr_text || "UNKNOWN"}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-xs text-text-secondary capitalize">
                {v.violation_type}
              </span>
            </TableCell>
            <TableCell>
              <span className="font-mono text-xs text-text-secondary">
                {formatDwell(v.dwell_seconds)}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-xs text-text-muted">
                {formatTimestamp(v.timestamp)}
              </span>
            </TableCell>
            <TableCell>
              <Badge variant={statusVariant(v.status)}>{v.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
