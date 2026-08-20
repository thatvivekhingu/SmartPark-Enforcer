"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  Car, 
  AlertTriangle, 
  FileText, 
  Cpu, 
  Video, 
  Radio, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusPill } from "@/components/shared/StatusPill";

interface Incident {
  id: number;
  plate: string;
  location: string;
  status: "CONFIRMED" | "PENDING";
  timeRecorded: string;
  dwell: string;
}

const LIVE_INCIDENTS: Incident[] = [
  {
    id: 1,
    plate: "NL 01 C 7821",
    location: "Street No-Parking Curb, Nagaland",
    status: "CONFIRMED",
    timeRecorded: "09:02 AM",
    dwell: "05:12",
  },
  {
    id: 2,
    plate: "MH 12 AB 3456",
    location: "Junction Gate No-Stop Zone",
    status: "PENDING",
    timeRecorded: "08:45 AM",
    dwell: "03:47",
  },
  {
    id: 3,
    plate: "DL 04 CA 7789",
    location: "Market Road Restricted Area",
    status: "CONFIRMED",
    timeRecorded: "08:21 AM",
    dwell: "07:05",
  },
];

const RECENT_CHALLANS = [
  {
    id: 1,
    number: "GJ01TP5892615",
    plate: "GJ 01 AB 1234",
    type: "Car · Maruti Swift",
    zone: "C.G. Road, Ahmedabad",
    amount: 1000,
    time: "11:25 AM",
    status: "PENDING",
  },
  {
    id: 2,
    number: "SPE-NL01C7821-001",
    plate: "NL 01 C 7821",
    type: "Car · Maruti 800",
    zone: "Street No-Parking Curb, Nagaland",
    amount: 500,
    time: "09:02 AM",
    status: "ISSUED",
  },
  {
    id: 3,
    number: "SPE-NL07B4419-002",
    plate: "NL 07 B 4419",
    type: "SUV · Brezza",
    zone: "Commercial Bay No-Parking",
    amount: 500,
    time: "08:45 AM",
    status: "PAID",
  },
  {
    id: 4,
    number: "SPE-NL01A9310-003",
    plate: "NL 01 A 9310",
    type: "SUV · Creta",
    zone: "Junction Gate No-Parking",
    amount: 1000,
    time: "08:12 AM",
    status: "ISSUED",
  },
  {
    id: 5,
    number: "SPE-DL03CD4521-005",
    plate: "DL 03 CD 4521",
    type: "Motorcycle · Pulsar",
    zone: "Market Road No-Parking",
    amount: 500,
    time: "07:30 AM",
    status: "PAID",
  },
];

export default function OverviewPage() {
  const router = useRouter();

  return (
    <div className="p-8 space-y-8 min-h-screen text-[#1d1d1f] font-sans max-w-7xl mx-auto">
      {/* ── 1. Page Header (Apple Clean Typography) ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#0071E3] tracking-wide uppercase">
            Surveillance & Enforcement
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] mt-1">
            Command Center
          </h1>
          <p className="text-sm text-[#86868b] mt-1">
            Real-time automated traffic violation monitoring and citation management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/upload")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Upload Evidence & Issue Challan
          </button>
        </div>
      </div>

      {/* ── 2. Top Stats Cards Grid (Apple Pure White Cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Vehicles Monitored"
          value={105}
          badge="Live"
          badgeVariant="green"
          icon={<Car className="w-5 h-5 text-[#0071E3]" />}
        />

        <StatCard
          label="Active Violations"
          value={3}
          badge="3 flagged"
          badgeVariant="red"
          icon={<AlertTriangle className="w-5 h-5 text-[#ff3b30]" />}
        />

        <StatCard
          label="Challans Issued"
          value={15}
          badge="Today"
          badgeVariant="green"
          icon={<FileText className="w-5 h-5 text-[#0071E3]" />}
        />

        <StatCard
          label="AI OCR Accuracy"
          value="96.2%"
          badge="High"
          badgeVariant="green"
          icon={<Cpu className="w-5 h-5 text-[#34c759]" />}
        />
      </div>

      {/* ── 3. Main Operations Grid: Video Feed + Live Incidents ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Live AI Surveillance Video Feed (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34c759] animate-pulse" />
              <div>
                <h3 className="text-sm font-semibold text-[#1d1d1f]">
                  Live AI Detection Feed
                </h3>
                <p className="text-xs text-[#86868b]">
                  CAM-01 · Nagaland Commercial Strip
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-black/[0.04] text-[11px] font-mono font-semibold text-[#6e6e73]">
              30 FPS · 1080p Stream
            </span>
          </div>

          {/* Video Player */}
          <div className="relative bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-inner">
            <video
              src="/videos/annotated_output.mp4"
              autoPlay
              loop
              muted
              playsInline
              controls
              className="w-full h-full object-contain"
            />

            {/* Overlays */}
            <div className="absolute top-3 left-3 space-y-1.5 pointer-events-none z-10">
              <div className="px-3 py-1 rounded-lg bg-white/95 backdrop-blur text-[#1d1d1f] text-[11px] font-mono font-bold shadow-md border border-black/[0.08]">
                ILLEGAL PARKING · TIMER: 05:12
              </div>
            </div>

            <div className="absolute bottom-3 right-3 pointer-events-none">
              <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur text-[10px] font-mono text-white/90">
                ACTIVE GEOFENCE: 300S DWELL
              </span>
            </div>
          </div>
        </div>

        {/* Right: Real-time Incident Stream (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#ff3b30] animate-pulse" />
              <h3 className="text-sm font-semibold text-[#1d1d1f]">
                Active Incident Stream
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ff3b30]/10 text-[#c72820]">
              3 active
            </span>
          </div>

          {/* Incidents List */}
          <div className="divide-y divide-black/[0.06] flex-1">
            {LIVE_INCIDENTS.map((inc) => (
              <div
                key={inc.id}
                onClick={() => router.push(`/violations/${inc.id}`)}
                className="py-3.5 first:pt-1 last:pb-1 hover:bg-black/[0.02] -mx-2 px-2 rounded-xl transition-colors cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#0071E3] bg-[#0071E3]/10 px-2 py-0.5 rounded-md">
                    {inc.plate}
                  </span>
                  <StatusPill status={inc.status} />
                </div>

                <div className="flex items-center justify-between text-xs text-[#6e6e73]">
                  <span className="truncate pr-2">{inc.location}</span>
                  <span className="font-mono font-semibold text-[#ff3b30] shrink-0">
                    {inc.dwell}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/violations")}
            className="w-full py-2.5 rounded-xl bg-black/[0.03] hover:bg-black/[0.06] text-xs font-semibold text-[#1d1d1f] flex items-center justify-center gap-1.5 transition-colors"
          >
            View All Violations <ChevronRight className="w-3.5 h-3.5 text-[#86868b]" />
          </button>
        </div>
      </div>

      {/* ── 4. Recent Citations & Challans Ledger Table ── */}
      <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
          <div>
            <h3 className="text-base font-semibold text-[#1d1d1f]">
              Recent Digital Challans
            </h3>
            <p className="text-xs text-[#86868b] mt-0.5">
              Verified citations issued through automated AI detection
            </p>
          </div>
          <button
            onClick={() => router.push("/challans")}
            className="text-xs font-semibold text-[#0071E3] hover:underline flex items-center gap-1"
          >
            View All Challans <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-black/[0.06] text-[#86868b] text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Challan Number</th>
                <th className="py-3 px-4">Vehicle Plate</th>
                <th className="py-3 px-4">Vehicle Type</th>
                <th className="py-3 px-4">Enforcement Zone</th>
                <th className="py-3 px-4">Fine Amount</th>
                <th className="py-3 px-4">Issued Time</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {RECENT_CHALLANS.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => router.push(`/challans/${c.id}`)}
                  className="hover:bg-black/[0.02] cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#0071E3]">
                    {c.number}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1d1d1f]">
                    {c.plate}
                  </td>
                  <td className="py-3.5 px-4 text-[#6e6e73]">
                    {c.type}
                  </td>
                  <td className="py-3.5 px-4 text-[#6e6e73] truncate max-w-xs">
                    {c.zone}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#1d1d1f]">
                    ₹{c.amount}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#86868b]">
                    {c.time}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusPill status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
