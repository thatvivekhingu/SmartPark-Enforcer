"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  ArrowUpDown
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusPill } from "@/components/shared/StatusPill";
import { StatCard } from "@/components/shared/StatCard";
import type { ChallanStatus } from "@/types";

interface DemoChallan {
  id: number;
  challan_number: string;
  plate: string;
  vehicle_type: string;
  violation_type: string;
  zone: string;
  dwell_minutes: number;
  fine_amount: number;
  issued_at: string;
  status: ChallanStatus;
  sha256_hash: string;
}

const DEMO_CHALLANS: DemoChallan[] = [
  {
    id: 1,
    challan_number: "SPE-NL01C7821-001",
    plate: "NL 01 C 7821",
    vehicle_type: "Car (Maruti 800)",
    violation_type: "Illegal Parking (>5m Dwell)",
    zone: "Nagaland Main Street Curb",
    dwell_minutes: 6.2,
    fine_amount: 500,
    issued_at: "2026-08-20 09:02:15",
    status: "issued",
    sha256_hash: "8d757e4b98eb3b5b53c7ddcf9e2dc4102cb9f3fc24bdecaa38310020ab44d362",
  },
  {
    id: 2,
    challan_number: "SPE-NL07B4419-002",
    plate: "NL 07 B 4419",
    vehicle_type: "SUV (White Brezza)",
    violation_type: "Illegal Parking (>5m Dwell)",
    zone: "Commercial Bay No-Parking",
    dwell_minutes: 8.5,
    fine_amount: 500,
    issued_at: "2026-08-20 08:45:30",
    status: "paid",
    sha256_hash: "3f89a1c0d4e5f678901234567890abcdef1234567890abcdef1234567890abcd",
  },
  {
    id: 3,
    challan_number: "SPE-NL01A9310-003",
    plate: "NL 01 A 9310",
    vehicle_type: "SUV (Black Creta)",
    violation_type: "Obstruction of Traffic",
    zone: "Junction Gate No-Parking",
    dwell_minutes: 12.0,
    fine_amount: 1000,
    issued_at: "2026-08-20 08:12:00",
    status: "issued",
    sha256_hash: "9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
  },
  {
    id: 4,
    challan_number: "SPE-MH02AB0018-004",
    plate: "MH 02 AB 0018",
    vehicle_type: "Sedan (Silver Honda)",
    violation_type: "Illegal Parking (>5m Dwell)",
    zone: "Terminal 1 Gate Zone",
    dwell_minutes: 5.8,
    fine_amount: 500,
    issued_at: "2026-08-20 07:55:20",
    status: "disputed",
    sha256_hash: "5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
  },
  {
    id: 5,
    challan_number: "SPE-DL03CD4521-005",
    plate: "DL 03 CD 4521",
    vehicle_type: "Motorcycle (Pulsar)",
    violation_type: "Sidewalk Parking",
    zone: "Market Road No-Parking",
    dwell_minutes: 15.4,
    fine_amount: 500,
    issued_at: "2026-08-19 18:30:10",
    status: "paid",
    sha256_hash: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
  },
  {
    id: 6,
    challan_number: "SPE-KA04EF6789-006",
    plate: "KA 04 EF 6789",
    vehicle_type: "Delivery Van",
    violation_type: "Loading Zone Violation",
    zone: "Nagaland Main Street Curb",
    dwell_minutes: 22.1,
    fine_amount: 1500,
    issued_at: "2026-08-19 16:45:00",
    status: "paid",
    sha256_hash: "4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
  },
];

export default function ChallansPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredChallans = DEMO_CHALLANS.filter((c) => {
    const matchesSearch =
      c.challan_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || c.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalCollected = DEMO_CHALLANS.filter((c) => c.status === "paid").reduce(
    (acc, curr) => acc + curr.fine_amount,
    0
  );
  const pendingAmount = DEMO_CHALLANS.filter((c) => c.status === "issued").reduce(
    (acc, curr) => acc + curr.fine_amount,
    0
  );

  return (
    <div className="min-h-screen bg-ink text-text-primary p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="Digital Challans"
        description="Tamper-evident electronic parking citations with SHA-256 integrity verification"
        breadcrumbs={[{ label: "Overview", href: "/overview" }, { label: "Challans" }]}
        actions={
          <Link
            href="/upload"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand/90 transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Issue New Challan
          </Link>
        }
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Challans Issued"
          value={DEMO_CHALLANS.length}
          icon={<FileText className="h-4 w-4 text-brand" />}
          accent="brand"
        />
        <StatCard
          label="Active / Unpaid"
          value={DEMO_CHALLANS.filter((c) => c.status === "issued").length}
          icon={<Clock className="h-4 w-4 text-warning" />}
          accent="warning"
        />
        <StatCard
          label="Paid Revenue"
          value={`₹${totalCollected.toLocaleString("en-IN")}`}
          icon={<CheckCircle2 className="h-4 w-4 text-success" />}
          accent="success"
        />
        <StatCard
          label="Pending Collection"
          value={`₹${pendingAmount.toLocaleString("en-IN")}`}
          icon={<AlertCircle className="h-4 w-4 text-danger" />}
          accent="danger"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-border">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search by plate number, challan ID, or zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-elevated border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-elevated p-1 rounded-lg border border-border">
          {["ALL", "ISSUED", "PAID", "DISPUTED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 rounded text-[11px] font-medium transition-all ${
                statusFilter === tab
                  ? "bg-brand text-white shadow-sm font-semibold"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Challans Table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-elevated/50 text-text-secondary font-medium">
                <th className="py-3 px-4">Challan Number</th>
                <th className="py-3 px-4">Vehicle Plate</th>
                <th className="py-3 px-4">Violation Type</th>
                <th className="py-3 px-4">Zone / Location</th>
                <th className="py-3 px-4">Fine Amount</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-[11px]">
              {filteredChallans.map((challan) => (
                <tr
                  key={challan.id}
                  onClick={() => router.push(`/challans/${challan.id}`)}
                  className="hover:bg-elevated/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 font-semibold text-brand group-hover:underline">
                    {challan.challan_number}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded bg-black/60 border border-yellow-500/30 text-[#FCD34D] font-bold">
                      {challan.plate}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-text-secondary">
                    {challan.violation_type}
                  </td>
                  <td className="py-3 px-4 font-sans text-text-secondary">
                    {challan.zone}
                  </td>
                  <td className="py-3 px-4 font-bold text-text-primary">
                    ₹{challan.fine_amount}
                  </td>
                  <td className="py-3 px-4 font-sans text-text-muted">
                    {challan.issued_at}
                  </td>
                  <td className="py-3 px-4">
                    <StatusPill status={challan.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/challans/${challan.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded hover:bg-elevated text-text-muted hover:text-text-primary transition-colors"
                        title="View Full Challan"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/verify/${challan.challan_number}`}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded hover:bg-elevated text-text-muted hover:text-success transition-colors"
                        title="Public QR Verification"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </Link>
                    </div>
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
