"use client";

import React, { useState } from "react";
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
  Upload,
  Camera,
  BarChart2,
  Settings,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Search,
  CheckCircle2
} from "lucide-react";
import { StatusPill } from "@/components/shared/StatusPill";

interface Incident {
  id: number;
  plate: string;
  location: string;
  status: "CONFIRMED" | "PENDING";
  timeRecorded: string;
  dwell: string;
}

const CATEGORY_ITEMS = [
  { label: "Overview", icon: Car, href: "/overview" },
  { label: "Data Hub", icon: Upload, href: "/upload" },
  { label: "Live Feeds", icon: Video, href: "/cameras" },
  { label: "Incidents", icon: AlertTriangle, href: "/violations" },
  { label: "Challans", icon: FileText, href: "/challans" },
  { label: "Camera Grid", icon: Camera, href: "/cameras" },
  { label: "Analytics", icon: BarChart2, href: "/analytics" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

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
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] p-6 lg:p-10 space-y-12 font-sans max-w-7xl mx-auto">
      
      {/* ── 1. Top Apple Store-Style Header Section ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1D1D1F]">
            Enforcement
          </h1>
        </div>

        <div className="space-y-1 text-sm md:text-right">
          <p className="text-base sm:text-lg font-medium text-[#1D1D1F]">
            The smartest way to monitor, detect and issue citations.
          </p>
          <div className="flex flex-wrap md:justify-end gap-x-5 gap-y-1 text-xs sm:text-sm font-medium">
            <button
              onClick={() => router.push("/upload")}
              className="text-[#0071E3] hover:underline flex items-center gap-1"
            >
              Upload Evidence Photo <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => router.push("/challans")}
              className="text-[#0071E3] hover:underline flex items-center gap-1"
            >
              View Official Challans <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Apple Horizontal Category Icon Strip ── */}
      <div className="flex items-center gap-6 sm:gap-10 overflow-x-auto pb-3 pt-1 no-scrollbar select-none">
        {CATEGORY_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          const isSelected = item.href === "/overview";

          return (
            <button
              key={idx}
              onClick={() => router.push(item.href)}
              className="flex flex-col items-center gap-2 group shrink-0 focus:outline-none"
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? "bg-[#0071E3] text-white shadow-md scale-105"
                    : "bg-white text-[#1D1D1F] border border-black/[0.06] shadow-sm group-hover:bg-white group-hover:scale-105 group-hover:shadow-md"
                }`}
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <span
                className={`text-xs font-medium tracking-tight whitespace-nowrap transition-colors ${
                  isSelected
                    ? "text-[#0071E3] font-semibold"
                    : "text-[#1D1D1F] group-hover:text-[#0071E3]"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 3. "The latest." Featured Bento Cards Carousel / Grid (Exact Screenshot 1) ── */}
      <div className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          <span className="text-[#1D1D1F]">The latest.</span>{" "}
          <span className="text-[#6E6E73]">Take a look at active enforcement right now.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Card 1 (Hero Deep Black Card - like iPhone 17 Pro in Screenshot 1) */}
          <div className="rounded-[28px] bg-black text-white p-7 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.35)] min-h-[460px] relative overflow-hidden group">
            <div className="space-y-1.5 z-10">
              <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-widest block">
                LIVE AI SURVEILLANCE
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                CAM-01 · Commercial Strip
              </h3>
              <p className="text-sm text-[#A1A1A6]">
                Stationary vehicle overstaying in No-Parking Curb.
              </p>
              <p className="text-xs text-[#86868B] pt-0.5">
                Plate: <strong className="text-white">NL 01 C 7821</strong> · Fine: ₹500
              </p>
            </div>

            {/* Video preview container inside black card */}
            <div className="relative rounded-2xl overflow-hidden bg-neutral-950 aspect-video my-4 border border-white/15 shadow-2xl">
              <video
                src="/videos/annotated_output.mp4"
                autoPlay
                loop
                muted
                playsInline
                controls
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-mono text-emerald-400 font-bold border border-emerald-500/30">
                ● 30 FPS LIVE
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 z-10">
              <button
                onClick={() => router.push("/violations/1")}
                className="px-5 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors shadow-sm"
              >
                Inspect Violation
              </button>
              <span className="text-xs text-[#86868B]">Dwell: 05:12</span>
            </div>
          </div>

          {/* Bento Card 2 (Pure White Card - like MacBook Neo in Screenshot 1) */}
          <div className="rounded-[28px] bg-white border border-black/[0.06] p-7 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 min-h-[460px]">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#FF9500] uppercase tracking-widest block">
                INSTANT SCAN
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                Photo to E-Challan
              </h3>
              <p className="text-sm text-[#6E6E73]">
                Upload any traffic image. AI reads plate, queries citizen records, and outputs official citation.
              </p>
              <p className="text-xs text-[#86868B] pt-0.5">
                Accuracy: <strong className="text-[#1D1D1F]">96.2% OCR Precision</strong>
              </p>
            </div>

            {/* Visual Upload Trigger Frame */}
            <div
              onClick={() => router.push("/upload")}
              className="my-4 rounded-2xl border-2 border-dashed border-black/[0.1] bg-[#F5F5F7] p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#0071E3] hover:bg-[#0071E3]/5 transition-colors group aspect-video"
            >
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#0071E3] group-hover:scale-110 transition-transform mb-2">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-[#1D1D1F]">
                Drop Violation Photo
              </span>
              <span className="text-[11px] text-[#86868B]">
                JPG, PNG or CCTV snapshot
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => router.push("/upload")}
                className="px-5 py-2 rounded-full bg-[#0071E3] text-white text-xs font-semibold hover:bg-[#0077ED] transition-colors shadow-sm"
              >
                Upload & Generate
              </button>
              <span className="text-xs text-[#86868B]">Step 1 of 3</span>
            </div>
          </div>

          {/* Bento Card 3 (Deep Black Card - like Education Savings in Screenshot 1) */}
          <div className="rounded-[28px] bg-black text-white p-7 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.35)] min-h-[460px] relative overflow-hidden">
            <div className="space-y-1.5 z-10">
              <span className="text-[11px] font-bold text-[#FF3B30] uppercase tracking-widest block">
                AUTOMATED RULES
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                Geofence Perimeter
              </h3>
              <p className="text-sm text-[#A1A1A6]">
                4 CCTV camera streams running real-time ByteTrack vehicle tracking.
              </p>
              <p className="text-xs text-[#86868B] pt-0.5">
                Active Nodes: <strong className="text-white">4 / 4 Online</strong>
              </p>
            </div>

            {/* Visual Geofence graphic */}
            <div className="my-4 rounded-2xl bg-neutral-900 border border-white/10 p-5 flex flex-col justify-center space-y-3 aspect-video">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#86868B]">Zone A - Main Curb:</span>
                <span className="text-emerald-400 font-bold">● ACTIVE</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#86868B]">Zone B - Terminal 1:</span>
                <span className="text-emerald-400 font-bold">● ACTIVE</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#86868B]">Dwell Threshold:</span>
                <span className="text-amber-400 font-bold">300s (5m)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 z-10">
              <button
                onClick={() => router.push("/cameras")}
                className="px-5 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors shadow-sm"
              >
                Manage Camera Nodes
              </button>
              <span className="text-xs text-[#86868B]">105 Vehicles</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Telemetrics & Reports (Apple Stat Cards) ── */}
      <div className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          <span className="text-[#1D1D1F]">Telemetrics.</span>{" "}
          <span className="text-[#6E6E73]">Real-time municipal statistics.</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-[24px] p-6 bg-white border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B] block mb-2">
              Total Vehicles Monitored
            </span>
            <div className="text-4xl font-bold tracking-tight text-[#1D1D1F]">
              105
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Live Camera Stream
            </p>
          </div>

          <div className="rounded-[24px] p-6 bg-white border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B] block mb-2">
              Active Violations
            </span>
            <div className="text-4xl font-bold tracking-tight text-[#FF3B30]">
              3
            </div>
            <p className="text-xs text-red-600 font-semibold mt-2">
              Requires immediate action
            </p>
          </div>

          <div className="rounded-[24px] p-6 bg-white border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B] block mb-2">
              Challans Issued
            </span>
            <div className="text-4xl font-bold tracking-tight text-[#1D1D1F]">
              15
            </div>
            <p className="text-xs text-[#86868B] font-medium mt-2">
              ₹12,500 total penalty logged
            </p>
          </div>

          <div className="rounded-[24px] p-6 bg-white border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B] block mb-2">
              OCR Recognition Accuracy
            </span>
            <div className="text-4xl font-bold tracking-tight text-[#0071E3]">
              96.2%
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-2">
              High confidence score
            </p>
          </div>
        </div>
      </div>

      {/* ── 5. "Recent Citations & Incident Ledger" (Screenshot 2 / Help is here style) ── */}
      <div className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          <span className="text-[#1D1D1F]">Citation Register.</span>{" "}
          <span className="text-[#6E6E73]">Verified digital e-challans issued.</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Table of Challans (7 cols) */}
          <div className="lg:col-span-7 rounded-[24px] border border-black/[0.06] bg-white p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
              <div>
                <h3 className="text-lg font-bold text-[#1D1D1F]">
                  Recent E-Challans
                </h3>
                <p className="text-xs text-[#86868B]">
                  Official citations logged with SHA-256 digital signature
                </p>
              </div>
              <button
                onClick={() => router.push("/challans")}
                className="text-xs font-semibold text-[#0071E3] hover:underline"
              >
                View All ↗
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black/[0.06] text-[#86868B] text-[11px] font-semibold uppercase tracking-wider">
                    <th className="py-3 px-3">Challan No.</th>
                    <th className="py-3 px-3">Plate</th>
                    <th className="py-3 px-3">Fine</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04]">
                  {RECENT_CHALLANS.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => router.push(`/challans/${c.id}`)}
                      className="hover:bg-black/[0.02] cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-3 font-mono font-semibold text-[#0071E3]">
                        {c.number}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#1D1D1F]">
                        {c.plate}
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#1D1D1F]">
                        ₹{c.amount}
                      </td>
                      <td className="py-3 px-3">
                        <StatusPill status={c.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Active Live Incidents (5 cols) */}
          <div className="lg:col-span-5 rounded-[24px] border border-black/[0.06] bg-white p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B30] animate-pulse" />
                  <h3 className="text-lg font-bold text-[#1D1D1F]">
                    Live Incident Stream
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FF3B30]/10 text-[#C72820]">
                  3 Active
                </span>
              </div>

              <div className="divide-y divide-black/[0.06]">
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

                    <div className="flex items-center justify-between text-xs text-[#6E6E73]">
                      <span className="truncate pr-2">{inc.location}</span>
                      <span className="font-mono font-semibold text-[#FF3B30]">
                        {inc.dwell}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => router.push("/violations")}
              className="w-full py-3 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-xs font-semibold text-[#1D1D1F] flex items-center justify-center gap-1.5 transition-colors mt-4"
            >
              View Full Incident Register <ChevronRight className="w-3.5 h-3.5 text-[#86868B]" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
