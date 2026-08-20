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
  ShieldAlert,
  Search,
  CheckCircle2,
  Download,
  Printer,
  Eye,
  MapPin,
  Flame,
  ArrowUpRight,
  RefreshCw,
  SlidersHorizontal,
  Layers,
  Database
} from "lucide-react";
import { StatusPill } from "@/components/shared/StatusPill";

interface ViolationItem {
  id: number;
  plate: string;
  vehicle: string;
  zone: string;
  camera: string;
  rule: string;
  dwell: string;
  penalty: number;
  status: "CRITICAL" | "PENDING" | "CONFIRMED";
  timestamp: string;
}

const ACTIVE_VIOLATIONS: ViolationItem[] = [
  {
    id: 1,
    plate: "NL 01 C 7821",
    vehicle: "Maruti 800 (White Car)",
    zone: "Commercial Curb, Nagaland",
    camera: "CAM-01 (Node North)",
    rule: "Sec 122/177 MVA - Obstruction of Public Way",
    dwell: "05:12 (Limit: 05:00)",
    penalty: 500,
    status: "CRITICAL",
    timestamp: "11:24:10 AM",
  },
  {
    id: 2,
    plate: "MH 12 AB 3456",
    vehicle: "Hyundai Creta (Silver SUV)",
    zone: "Junction Gate Emergency Corridor",
    camera: "CAM-02 (Junction East)",
    rule: "Sec 177 MVA - No-Stopping Yellow Box",
    dwell: "03:47 (Limit: 02:00)",
    penalty: 1000,
    status: "PENDING",
    timestamp: "11:20:05 AM",
  },
  {
    id: 3,
    plate: "DL 04 CA 7789",
    vehicle: "Tata 407 (Commercial Truck)",
    zone: "Market Loading Bay Restricted",
    camera: "CAM-03 (Market Central)",
    rule: "Sec 122 MVA - Unauthorized Freight Parking",
    dwell: "07:05 (Limit: 05:00)",
    penalty: 1000,
    status: "CRITICAL",
    timestamp: "11:15:32 AM",
  },
];

const RECENT_CHALLANS = [
  {
    id: 1,
    challanNo: "GJ01TP5892615",
    plate: "GJ 01 AB 1234",
    vehicle: "Maruti Suzuki Swift Dzire",
    owner: "Rahul Sharma",
    location: "C.G. Road, Ahmedabad",
    rule: "122/177 MVA",
    fine: 1000,
    time: "20-06-2025 · 11:25 AM",
    status: "PENDING",
  },
  {
    id: 2,
    challanNo: "SPE-NL01C7821-001",
    plate: "NL 01 C 7821",
    vehicle: "Maruti 800 (LMV)",
    owner: "State Registry Lookup",
    location: "Commercial Curb, Dimapur",
    rule: "122/177 MVA",
    fine: 500,
    time: "20-08-2026 · 09:02 AM",
    status: "ISSUED",
  },
  {
    id: 3,
    challanNo: "SPE-NL07B4419-002",
    plate: "NL 07 B 4419",
    vehicle: "Maruti Brezza (SUV)",
    owner: "K. Sema",
    location: "Commercial Bay No-Parking",
    rule: "122 MVA",
    fine: 500,
    time: "20-08-2026 · 08:45 AM",
    status: "PAID",
  },
  {
    id: 4,
    challanNo: "SPE-NL01A9310-003",
    plate: "NL 01 A 9310",
    vehicle: "Hyundai Creta",
    owner: "T. Ao",
    location: "Junction Gate No-Parking",
    rule: "177 MVA",
    fine: 1000,
    time: "20-08-2026 · 08:12 AM",
    status: "ISSUED",
  },
  {
    id: 5,
    challanNo: "SPE-DL03CD4521-005",
    plate: "DL 03 CD 4521",
    vehicle: "Bajaj Pulsar 150",
    owner: "Amit Verma",
    location: "Market Road No-Parking",
    rule: "122 MVA",
    fine: 500,
    time: "20-08-2026 · 07:30 AM",
    status: "PAID",
  },
];

export default function OverviewPage() {
  const router = useRouter();
  const [activeCam, setActiveCam] = useState<string>("CAM-01");

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] p-6 lg:p-8 space-y-7 font-sans">
      
      {/* ── 1. Official National Institutional Top Header ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          {/* National Emblem Badge Icon */}
          <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-b from-slate-900 to-slate-800 text-amber-400 flex items-center justify-center p-2 shadow-sm border border-slate-700">
            <svg viewBox="0 0 100 120" fill="none" className="w-full h-full text-amber-400">
              <path
                d="M50 8 C40 8 36 18 36 28 C36 34 40 40 46 42 C34 44 24 54 24 68 C24 82 38 88 50 88 C62 88 76 82 76 68 C76 54 66 44 54 42 C60 40 64 34 64 28 C64 18 60 8 50 8 Z"
                fill="currentColor"
              />
              <circle cx="50" cy="98" r="9" stroke="currentColor" strokeWidth="3" />
              <path d="M50 89 V107 M41 98 H59" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                MoRTH · ITMS National Grid
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                ICCC Node #004 · Gujarat / Nagaland
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Integrated Traffic Enforcement & E-Challan Command Center
            </h1>
            <p className="text-xs text-slate-500">
              Real-time AI Video Telemetry · Automated ANPR License Plate Recognition · Parivahan Vahan 4.0 Integration
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => router.push("/upload")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Upload className="w-4 h-4" />
            Upload Evidence & Issue Challan
          </button>
          <button
            onClick={() => router.push("/challans")}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-300/80"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            All Challans
          </button>
        </div>
      </div>

      {/* ── 2. Real-Time Telemetry & Executive KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Vehicles Scanned */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Vehicles Scanned
            </span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Car className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              1,420
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-medium">
              <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                +8.4%
              </span>
              <span>ANPR Accuracy: <strong>98.6%</strong></span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Violations */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Violations Flagged
            </span>
            <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-red-600 tracking-tight">
              3
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-700 font-semibold">Immediate Action Required</span>
            </div>
          </div>
        </div>

        {/* Card 3: Challans Issued Today */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Challans Issued Today
            </span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              18
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-medium">
              <span>Total Fine Imposed: <strong className="text-slate-800">₹14,500</strong></span>
            </div>
          </div>
        </div>

        {/* Card 4: Fine Recovery Rate */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Digital Payment Clearance
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-600 tracking-tight">
              68.5%
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-medium">
              <span>Settled via Parivahan: <strong className="text-emerald-700">₹9,930</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Operational Grid: Live CCTV ANPR Cockpit (60%) + Violation Queue (40%) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live CCTV Surveillance & ANPR Tracking (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
          {/* Header with Camera Node Switcher */}
          <div className="p-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 font-mono">
                  LIVE SURVEILLANCE FEED · ANPR HUD
                </h2>
                <p className="text-[11px] text-slate-500 font-mono">
                  Dimapur Commercial Corridor · 30 FPS · GPS: 25.9044° N, 93.7275° E
                </p>
              </div>
            </div>

            {/* Camera Switcher Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs text-xs font-mono font-bold">
              {["CAM-01", "CAM-02", "CAM-03", "CAM-04"].map((cam) => (
                <button
                  key={cam}
                  onClick={() => setActiveCam(cam)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeCam === cam
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {cam}
                </button>
              ))}
            </div>
          </div>

          {/* Video Player Frame with Realistic HUD telemetry */}
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

            {/* Top-Left Live ANPR Overlay HUD */}
            <div className="absolute top-3 left-3 space-y-1.5 pointer-events-none z-10 font-mono">
              <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur text-white text-[11px] border border-slate-700/80 shadow-lg space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-bold text-amber-300">VIOLATION DETECTED #TR89</span>
                </div>
                <div className="text-[10px] text-slate-300">
                  PLATE: <strong className="text-white">NL 01 C 7821</strong> · CONF: 94.2% · DWELL: 05:12
                </div>
              </div>
            </div>

            {/* Bottom-Right Geofence Status */}
            <div className="absolute bottom-3 right-3 pointer-events-none z-10">
              <div className="px-2.5 py-1 rounded bg-black/80 backdrop-blur text-slate-300 text-[10px] font-mono border border-white/20">
                GEOFENCE: NO-PARKING CURB (TIMEOUT: 300S)
              </div>
            </div>
          </div>

          {/* Footer Bar of Video Panel */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3 font-mono text-slate-600 text-[11px]">
              <span>Model: <strong>YOLO11 + ByteTrack</strong></span>
              <span>•</span>
              <span>Latency: <strong>33ms</strong></span>
              <span>•</span>
              <span>Resolution: <strong>1080p</strong></span>
            </div>
            <button
              onClick={() => router.push("/violations/1")}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              Generate Citation for CAM-01 <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Real-Time Violation Escalation Desk (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-600 animate-pulse" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 font-mono">
                LIVE VIOLATION QUEUE
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
              3 Pending Action
            </span>
          </div>

          {/* List of active violations */}
          <div className="divide-y divide-slate-100 p-2 space-y-1">
            {ACTIVE_VIOLATIONS.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/violations/${item.id}`)}
                className="p-3.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200 space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {item.plate}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {item.timestamp}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === "CRITICAL"
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-0.5">
                  <div className="font-semibold text-slate-800 truncate">{item.vehicle}</div>
                  <div className="text-slate-500 truncate">{item.zone} · {item.camera}</div>
                  <div className="text-red-700 font-mono font-bold text-[11px] pt-1">
                    Dwell Overstay: {item.dwell} · Penalty: ₹{item.penalty}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[11px] text-blue-600 group-hover:underline font-semibold flex items-center gap-1">
                    Review Evidence & Generate E-Challan <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200">
            <button
              onClick={() => router.push("/violations")}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              Open Full Enforcement Incident Ledger <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. Electronic Citations Judicial Ledger (Official Government Table) ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-0">
        <div className="p-5 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 font-mono">
                ELECTRONIC CHALLAN DISPATCH REGISTER
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                SHA-256 Digitally Signed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Official judicial records logged with tamper-evident digital cryptographic signatures under Motor Vehicles Act, 1988
            </p>
          </div>

          <button
            onClick={() => router.push("/challans")}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            All Registered Citations <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/80 text-slate-600 text-[11px] font-black uppercase tracking-wider font-mono">
                <th className="py-3.5 px-5">Challan Number</th>
                <th className="py-3.5 px-5">Registration Plate</th>
                <th className="py-3.5 px-5">Vehicle & Registered Owner</th>
                <th className="py-3.5 px-5">Enforcement Location</th>
                <th className="py-3.5 px-5">Offence Section</th>
                <th className="py-3.5 px-5">Penalty Fine</th>
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-5">Legal Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {RECENT_CHALLANS.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => router.push(`/challans/${c.id}`)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-5 font-mono font-bold text-blue-700">
                    {c.challanNo}
                  </td>
                  <td className="py-3.5 px-5 font-mono font-black text-slate-900">
                    {c.plate}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-slate-900">{c.vehicle}</div>
                    <div className="text-[11px] text-slate-500">{c.owner}</div>
                  </td>
                  <td className="py-3.5 px-5 text-slate-700 truncate max-w-xs">
                    {c.location}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-[11px] text-slate-600 font-semibold">
                    {c.rule}
                  </td>
                  <td className="py-3.5 px-5 font-bold text-slate-900 text-sm">
                    ₹{c.fine.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-slate-500 text-[11px]">
                    {c.time}
                  </td>
                  <td className="py-3.5 px-5">
                    <StatusPill status={c.status} />
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/challans/${c.id}`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition-colors"
                    >
                      View Citation PDF
                    </button>
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
