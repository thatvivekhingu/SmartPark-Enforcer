"use client";

import { useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Car, MapPin, AlertTriangle, FileText } from "lucide-react";

import Navbar from "@/components/dashboard/Navbar";
import StatCard from "@/components/dashboard/StatCard";
import LiveVideoPanel from "@/components/dashboard/LiveVideoPanel";
import ViolationsTable from "@/components/dashboard/ViolationsTable";
import DigitalChallanCard from "@/components/dashboard/DigitalChallanCard";
import LiveTrackerPanel from "@/components/dashboard/LiveTrackerPanel";
import EvidenceIntegrityCard from "@/components/dashboard/EvidenceIntegrityCard";

import { useStats, useViolations, useActiveTrackers } from "@/hooks/useSystemStatus";
import { useViolationSocket } from "@/hooks/useViolationSocket";
import { useSystemStatus } from "@/hooks/useSystemStatus";
import type { Violation, ViolationWsEvent } from "@/types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function DashboardInner() {
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(
    null
  );
  const [detectionInfo, setDetectionInfo] = useState<{
    vehicleId: string;
    plate: string;
    dwell: number;
    type: string;
  } | null>(null);

  const statsQuery = useStats();
  const violationsQuery = useViolations();
  const trackersQuery = useActiveTrackers();
  const statusQuery = useSystemStatus();

  const handleViolation = useCallback(
    (data: ViolationWsEvent["data"]) => {
      violationsQuery.refetch();
      statsQuery.refetch();
    },
    [violationsQuery, statsQuery]
  );

  const handleDetection = useCallback(
    (data: ViolationWsEvent["data"]) => {
      setDetectionInfo({
        vehicleId: (data.vehicle_id as string) || "",
        plate: (data.license_plate as string) || "UNKNOWN",
        dwell: (data.dwell_seconds as number) || 0,
        type: (data.vehicle_type as string) || "",
      });
    },
    []
  );

  const { connected } = useViolationSocket({
    onViolation: handleViolation,
    onDetection: handleDetection,
  });

  const stats = statsQuery.data;
  const violations = violationsQuery.data || [];
  const trackers = trackersQuery.data || [];
  const status = statusQuery.data || null;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar status={status} connected={connected} />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-[1440px] space-y-6">
          {/* Stat strip */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              label="Vehicles"
              value={stats?.total_vehicles ?? 0}
              icon={Car}
              loading={statsQuery.isLoading}
            />
            <StatCard
              label="In Zone"
              value={stats?.active_vehicles ?? 0}
              icon={MapPin}
              loading={statsQuery.isLoading}
            />
            <StatCard
              label="Violations"
              value={stats?.total_violations ?? 0}
              icon={AlertTriangle}
              accent
              loading={statsQuery.isLoading}
            />
            <StatCard
              label="Challans"
              value={stats?.total_challans ?? 0}
              icon={FileText}
              loading={statsQuery.isLoading}
            />
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Left column: video + violations */}
            <div className="space-y-4 lg:col-span-2">
              <LiveVideoPanel
                connected={connected}
                detectionInfo={detectionInfo}
              />

              <div className="rounded-card border border-border bg-app-card shadow-card">
                <div className="px-5 py-4 border-b border-border">
                  <span className="text-sm font-semibold text-text-primary">
                    Violations
                  </span>
                </div>
                <ViolationsTable
                  violations={violations}
                  loading={violationsQuery.isLoading}
                  onSelect={setSelectedViolation}
                />
              </div>
            </div>

            {/* Right column: panels */}
            <div className="space-y-4">
              <LiveTrackerPanel
                trackers={trackers}
                loading={trackersQuery.isLoading}
              />
              <DigitalChallanCard
                violation={selectedViolation}
                loading={violationsQuery.isLoading}
              />
              <EvidenceIntegrityCard
                violation={selectedViolation}
                loading={violationsQuery.isLoading}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border px-6 py-3">
        <div className="mx-auto max-w-[1440px] flex items-center justify-between">
          <span className="text-[11px] text-text-muted">
            SmartPark Enforcer v2.0
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-block h-[5px] w-[5px] rounded-full ${
                connected ? "bg-accent-success" : "bg-accent-danger"
              }`}
            />
            <span className="text-[11px] text-text-muted">
              {connected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardInner />
    </QueryClientProvider>
  );
}
