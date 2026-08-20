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
  ChevronRight
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
    plate: "NL01C7821",
    location: "Street No-Parking Curb, Nagaland",
    status: "CONFIRMED",
    timeRecorded: "09:02 AM",
    dwell: "05:12",
  },
  {
    id: 2,
    plate: "MH12AB3456",
    location: "Junction Gate No-Stop Zone",
    status: "PENDING",
    timeRecorded: "08:45 AM",
    dwell: "03:47",
  },
  {
    id: 3,
    plate: "DL4CAF7789",
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
    plate: "GJ01AB1234",
    type: "Car (Swift Dzire)",
    zone: "C.G. Road, Ahmedabad",
    amount: 1000,
    time: "11:25 AM",
    status: "PENDING",
  },
  {
    id: 2,
    number: "SPE-NL01C7821-001",
    plate: "NL 01 C 7821",
    type: "Car (Maruti 800)",
    zone: "Street No-Parking Curb, Nagaland",
    amount: 500,
    time: "09:02 AM",
    status: "ISSUED",
  },
  {
    id: 3,
    number: "SPE-NL07B4419-002",
    plate: "NL 07 B 4419",
    type: "SUV (Brezza)",
    zone: "Commercial Bay No-Parking",
    amount: 500,
    time: "08:45 AM",
    status: "PAID",
  },
  {
    id: 4,
    number: "SPE-NL01A9310-003",
    plate: "NL 01 A 9310",
    type: "SUV (Creta)",
    zone: "Junction Gate No-Parking",
    amount: 1000,
    time: "08:12 AM",
    status: "ISSUED",
  },
  {
    id: 5,
    number: "SPE-DL03CD4521-005",
    plate: "DL 03 CD 4521",
    type: "Motorcycle (Pulsar)",
    zone: "Market Road No-Parking",
    amount: 500,
    time: "07:30 AM",
    status: "PAID",
  },
];

export default function OverviewPage() {
  const router = useRouter();

  return (
    <div className="p-6 space-y-6 min-h-screen text-slate-100 font-sans">
      {/* ── 1. Page Header with Professional Serif Title ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#334155]">
        <div>
          <span className="text-[10px] font-bold text-amber-400 tracking-widest uppercase font-mono">
            Integrated Command and Control Centre (ICCC)
          </span>
          <h1 
            className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight mt-0.5"
            style={{ fontFamily: "Georgia, Merriweather, serif" }}
          >
            Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official Municipal Traffic Enforcement System · Nagaland Traffic Unit
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E293B] border border-[#334155] text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            LIVE TELEMETRY FEED
          </span>
        </div>
      </div>

      {/* ── 2. Top Stats Header Bar (Cream / Light Beige Cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Vehicles Inspected"
          value={105}
          badge="Low"
          badgeVariant="green"
          variant="cream"
          icon={<Car className="w-5 h-5 text-slate-700" />}
        />

        <StatCard
          label="Active Violations"
          value={3}
          badge="Low"
          badgeVariant="green"
          variant="cream"
          icon={<AlertTriangle className="w-5 h-5 text-slate-700" />}
        />

        <StatCard
          label="Challans Issued"
          value={15}
          badge="Normal"
          badgeVariant="green"
          variant="cream"
          icon={<FileText className="w-5 h-5 text-slate-700" />}
        />

        <StatCard
          label="OCR Accuracy"
          value="96.2%"
          variant="cream"
          icon={<Cpu className="w-5 h-5 text-slate-700" />}
        />
      </div>

      {/* ── 3. Main Operational Grid: CCTV Panel (60%) + Incident Stream (40%) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Municipal CCTV Feed Panel (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-[#334155] bg-[#1E293B] overflow-hidden shadow-md flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#334155] bg-[#0F172A]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-100 font-mono">
                  MUNICIPAL CCTV FEED
                </h3>
                <p className="text-[11px] text-slate-400">
                  Nagaland Street - Zone A | Active: Server 7
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              30 FPS · 640×360
            </span>
          </div>

          {/* Video Container with Clean Cream/Yellow Badge Overlays */}
          <div className="relative bg-black aspect-video flex-1 flex items-center justify-center overflow-hidden">
            <video
              src="/videos/annotated_output.mp4"
              autoPlay
              loop
              muted
              playsInline
              controls
              className="w-full h-full object-contain"
            />

            {/* Overlays (Cream / Yellow sharp badges per spec) */}
            <div className="absolute top-3 left-3 space-y-1.5 pointer-events-none z-10">
              <div className="px-2.5 py-1 rounded bg-[#FEF08A]/95 text-[#78350F] text-[10px] font-mono font-black border border-[#FDE047] shadow-sm">
                ILLEGAL PARKING #9 (TRUCK) | PLATE: NOT VISIBLE; TIMER: 00:01
              </div>
              <div className="px-2.5 py-1 rounded bg-[#FEF08A]/95 text-[#78350F] text-[10px] font-mono font-black border border-[#FDE047] shadow-sm">
                ILLEGAL PARKING #10 (CAR) | PLATE: NOT VISIBLE; TIMER: 00:00
              </div>
            </div>

            <div className="absolute bottom-3 right-3 pointer-events-none">
              <span className="px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-slate-300 border border-white/10">
                GEOFENCE: NO-PARKING CURB (300S)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Incident Stream Sidebar (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-[#334155] bg-[#1E293B] overflow-hidden shadow-md flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#334155] bg-[#0F172A]">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-100 font-mono">
                INCIDENT STREAM
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]">
              3 live
            </span>
          </div>

          {/* Incidents List */}
          <div className="divide-y divide-[#334155] flex-1">
            {LIVE_INCIDENTS.map((inc) => (
              <div
                key={inc.id}
                onClick={() => router.push(`/violations/${inc.id}`)}
                className="p-4 hover:bg-[#273549] transition-colors cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-amber-400 bg-black/40 px-2 py-0.5 rounded border border-amber-400/30">
                      {inc.plate}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {inc.timeRecorded}
                    </span>
                  </div>

                  {/* Soft Pastel Status Tag */}
                  <StatusPill status={inc.status} />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="truncate pr-2">{inc.location}</span>
                  <span className="font-mono font-bold text-red-400 shrink-0">
                    Dwell: {inc.dwell}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer of Incidents Sidebar */}
          <div className="p-3 bg-[#0F172A] border-t border-[#334155] text-center">
            <button
              onClick={() => router.push("/violations")}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 w-full"
            >
              View Full Incident Register <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. Recent Citations & Challans Ledger Table ── */}
      <div className="rounded-xl border border-[#334155] bg-[#1E293B] overflow-hidden shadow-md space-y-0">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#334155] bg-[#0F172A]">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-100 font-mono">
              RECENT CITATIONS & E-CHALLANS
            </h3>
            <p className="text-[11px] text-slate-400">
              Electronic citations logged in the municipal judicial ledger
            </p>
          </div>
          <button
            onClick={() => router.push("/challans")}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            All Challans <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-[#334155] bg-[#162032] text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-5">Challan Number</th>
                <th className="py-3 px-5">Vehicle Plate</th>
                <th className="py-3 px-5">Classification</th>
                <th className="py-3 px-5">Enforcement Zone</th>
                <th className="py-3 px-5">Penalty Fine</th>
                <th className="py-3 px-5">Time</th>
                <th className="py-3 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155] text-xs">
              {RECENT_CHALLANS.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => router.push(`/challans/${c.id}`)}
                  className="hover:bg-[#273549] cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-5 font-mono font-bold text-blue-400">
                    {c.number}
                  </td>
                  <td className="py-3.5 px-5 font-mono font-black text-amber-300">
                    {c.plate}
                  </td>
                  <td className="py-3.5 px-5 text-slate-300">
                    {c.type}
                  </td>
                  <td className="py-3.5 px-5 text-slate-300 truncate max-w-xs">
                    {c.zone}
                  </td>
                  <td className="py-3.5 px-5 font-bold text-slate-100">
                    ₹{c.amount}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-slate-400">
                    {c.time}
                  </td>
                  <td className="py-3.5 px-5">
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
