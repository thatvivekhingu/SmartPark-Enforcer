"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Copy,
  Check,
  QrCode,
  Calendar,
  Clock,
  MapPin,
  Car,
  UserCheck
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusPill } from "@/components/shared/StatusPill";
import jsPDF from "jspdf";

export default function ChallanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"issued" | "paid" | "disputed">("issued");

  const challanData = {
    id: id || "1",
    challan_number: `SPE-NL01C7821-00${id || "1"}`,
    plate: "NL 01 C 7821",
    owner_name: "Verified Citizen Lookup (Vahan DB)",
    vehicle_type: "Motor Car / LMV (Maruti 800)",
    violation_type: "Illegal Parking in Designated No-Parking Zone",
    rule_violated: "Section 122 / 177 Motor Vehicles Act (Overstay Dwell > 5m)",
    zone: "Nagaland Main Street Curb Zone (CAM-01)",
    dwell_duration: "06m 12s",
    fine_amount: 500,
    issued_at: "2026-08-20 09:02:15 IST",
    issuing_authority: "SmartPark AI Enforcement System v2.0",
    sha256_hash: "8d757e4b98eb3b5b53c7ddcf9e2dc4102cb9f3fc24bdecaa38310020ab44d362",
    evidence_image: "/evidence/violations/violation_youtube_test_tr89_20260819_184818.jpg",
    plate_image: "/evidence/plates/plate_youtube_test_tr89_20260819_184818.jpg",
  };

  const copyHash = () => {
    navigator.clipboard.writeText(challanData.sha256_hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header Banner
    doc.setFillColor(11, 13, 18);
    doc.rect(0, 0, 210, 38, "F");
    
    doc.setTextColor(237, 238, 241);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("MUNICIPAL TRAFFIC POLICE DEPARTMENT", 105, 16, { align: "center" });
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(144, 150, 163);
    doc.text("SMARTPARK ELECTRONIC TRAFFIC CITATION (E-CHALLAN)", 105, 26, { align: "center" });

    // Challan Details Box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(15, 45, 180, 180, 3, 3, "FD");

    doc.setTextColor(20, 20, 20);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`CHALLAN NO: ${challanData.challan_number}`, 22, 60);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Issued On: ${challanData.issued_at}`, 22, 68);
    doc.text(`Issuing Authority: ${challanData.issuing_authority}`, 22, 75);

    doc.setLineWidth(0.5);
    doc.line(22, 80, 185, 80);

    // Grid Table
    const fields = [
      ["Vehicle Registration No:", challanData.plate],
      ["Vehicle Classification:", challanData.vehicle_type],
      ["Registered Owner:", challanData.owner_name],
      ["Violation Specified:", challanData.violation_type],
      ["Legal Section:", challanData.rule_violated],
      ["Location / Zone:", challanData.zone],
      ["Dwell Time Recorded:", challanData.dwell_duration],
      ["Total Fine Amount:", `Rs. ${challanData.fine_amount} /-`],
      ["Payment Status:", status.toUpperCase()],
    ];

    let y = 90;
    fields.forEach(([label, val]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 22, y);
      doc.setFont("helvetica", "normal");
      doc.text(val, 85, y);
      y += 9;
    });

    // SHA-256 Block
    doc.setFillColor(235, 238, 245);
    doc.roundedRect(22, 175, 165, 22, 2, 2, "F");
    doc.setFontSize(8);
    doc.setFont("courier", "bold");
    doc.text("TAMPER-EVIDENT EVIDENCE HASH (SHA-256):", 26, 183);
    doc.setFont("courier", "normal");
    doc.text(challanData.sha256_hash, 26, 191);

    // Verification Info
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text(
      "Verify integrity online at: https://smart-park-enforcer-khaki.vercel.app/verify/" + challanData.challan_number,
      105,
      210,
      { align: "center" }
    );

    // Save
    doc.save(`challan_${challanData.challan_number}.pdf`);
  };

  return (
    <div className="min-h-screen bg-ink text-text-primary p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title={`Challan ${challanData.challan_number}`}
        description="Official electronic parking penalty citation with verifiable cryptographic certificate"
        breadcrumbs={[
          { label: "Overview", href: "/overview" },
          { label: "Challans", href: "/challans" },
          { label: challanData.challan_number }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/challans")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </button>
            <button
              onClick={generatePDF}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand/90 transition-all shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF Challan
            </button>
          </div>
        }
      />

      {/* Main Challan Document */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual Evidence */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-4 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                <Car className="h-3.5 w-3.5 text-brand" />
                CCTV Evidence Frame
              </span>
              <span className="text-[10px] font-mono text-text-muted">CAM-01 · 640×360</span>
            </div>
            <div className="rounded-lg overflow-hidden border border-border/80 bg-black aspect-video relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={challanData.evidence_image}
                alt="Violation evidence"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono text-[#FCD34D] border border-yellow-500/30">
                PLATE DETECTED: {challanData.plate}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 shadow-card space-y-3">
            <span className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
              <QrCode className="h-3.5 w-3.5 text-success" />
              Public Verification QR & Link
            </span>
            <div className="p-3 rounded-lg bg-elevated/60 border border-border space-y-2 text-center">
              <div className="w-24 h-24 mx-auto bg-white rounded-lg p-1.5 flex items-center justify-center">
                {/* Visual QR representation */}
                <div className="w-full h-full border-2 border-black grid grid-cols-4 grid-rows-4 p-1 gap-1">
                  <div className="bg-black col-span-2 row-span-2" />
                  <div className="bg-black" />
                  <div className="bg-black" />
                  <div className="bg-black col-span-2 row-span-2" />
                  <div className="bg-black" />
                  <div className="bg-black" />
                </div>
              </div>
              <p className="text-[11px] text-text-secondary">
                Windshield sticker QR code connects to public verification page.
              </p>
              <Link
                href={`/verify/${challanData.challan_number}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-[11px] font-mono text-brand hover:underline"
              >
                verify/{challanData.challan_number} →
              </Link>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Official Citation Record */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-surface p-6 shadow-card space-y-6">
            {/* Top Bar of Citation */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                  Official Citation Record
                </span>
                <h2 className="text-lg font-bold text-text-primary font-mono">
                  {challanData.challan_number}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill status={status} />
                <span className="text-lg font-bold font-mono text-text-primary">
                  ₹{challanData.fine_amount}
                </span>
              </div>
            </div>

            {/* Field Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-elevated/40 border border-border space-y-1">
                <span className="text-[10px] text-text-muted uppercase font-sans">
                  Vehicle Registration No.
                </span>
                <div className="text-sm font-bold text-[#FCD34D]">
                  {challanData.plate}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-elevated/40 border border-border space-y-1">
                <span className="text-[10px] text-text-muted uppercase font-sans">
                  Vehicle Classification
                </span>
                <div className="text-xs font-semibold text-text-primary font-sans">
                  {challanData.vehicle_type}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-elevated/40 border border-border space-y-1">
                <span className="text-[10px] text-text-muted uppercase font-sans">
                  Violation Category
                </span>
                <div className="text-xs font-semibold text-danger font-sans">
                  {challanData.violation_type}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-elevated/40 border border-border space-y-1">
                <span className="text-[10px] text-text-muted uppercase font-sans">
                  Dwell Time Recorded
                </span>
                <div className="text-xs font-bold text-danger">
                  {challanData.dwell_duration} (Threshold: 05:00)
                </div>
              </div>

              <div className="p-3 rounded-lg bg-elevated/40 border border-border space-y-1">
                <span className="text-[10px] text-text-muted uppercase font-sans">
                  Location & Zone
                </span>
                <div className="text-xs font-semibold text-text-primary font-sans">
                  {challanData.zone}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-elevated/40 border border-border space-y-1">
                <span className="text-[10px] text-text-muted uppercase font-sans">
                  Issuance Timestamp
                </span>
                <div className="text-xs font-semibold text-text-secondary">
                  {challanData.issued_at}
                </div>
              </div>
            </div>

            {/* SHA-256 Tamper Evident Block */}
            <div className="p-4 rounded-lg bg-black/40 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold text-success flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  SHA-256 Tamper-Evident Evidence Hash
                </span>
                <button
                  onClick={copyHash}
                  className="flex items-center gap-1 text-[10px] font-mono text-brand hover:underline"
                >
                  {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied" : "Copy Hash"}
                </button>
              </div>
              <p className="text-[11px] font-mono text-text-secondary break-all select-all">
                {challanData.sha256_hash}
              </p>
            </div>

            {/* Officer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                {status === "issued" && (
                  <button
                    onClick={() => setStatus("paid")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/20 border border-success/40 text-success text-xs font-semibold hover:bg-success/30 transition-colors"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Mark Fine as Paid
                  </button>
                )}
                {status === "paid" && (
                  <span className="text-xs text-success font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Fine Payment Received
                  </span>
                )}
              </div>

              <span className="text-[11px] font-mono text-text-muted">
                Authority: Municipal Traffic Police AI Desk
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
