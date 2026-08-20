'use client';

import React, { useState } from 'react';
import { Upload, ScanLine, CheckCircle2, Loader2, MapPin, Clock, FileText, User, AlignLeft } from 'lucide-react';
import ImageUploadZone from '@/components/upload/ImageUploadZone';
import DetectionResult from '@/components/upload/DetectionResult';
import ChallanPreview from '@/components/upload/ChallanPreview';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DetectionData {
  plate: string;
  confidence: number;
  vehicle_type: string;
  dwell_minutes: number;
  annotated_image_url?: string;
  original_image_url: string;
  bbox?: number[];
}

interface ChallanData {
  challan_number: string;
  plate: string;
  vehicle_type: string;
  dwell_minutes: number;
  fine_amount: number;
  zone: string;
  issued_at: string;
  sha256_hash: string;
  verify_url: string;
}

type Step = 1 | 2 | 3;

// ─── PDF Generator ────────────────────────────────────────────────────────────

async function generatePDF(challan: ChallanData): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const W = 210;

  // Background
  doc.setFillColor(11, 13, 18);
  doc.rect(0, 0, W, 297, 'F');

  // Top accent bar
  doc.setFillColor(76, 111, 255);
  doc.rect(0, 0, W, 12, 'F');

  // Authority header
  doc.setTextColor(237, 238, 241);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('MUNICIPAL TRAFFIC ENFORCEMENT AUTHORITY', W / 2, 24, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(144, 150, 163);
  doc.text('Government of India — SmartPark Enforcer System', W / 2, 31, { align: 'center' });

  // Title separator
  doc.setDrawColor(255, 255, 255, 0.1);
  doc.setLineWidth(0.4);
  doc.line(15, 36, W - 15, 36);

  // Challan title
  doc.setTextColor(76, 111, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DIGITAL PARKING CHALLAN', W / 2, 44, { align: 'center' });

  // Challan number box
  doc.setFillColor(25, 29, 37);
  doc.roundedRect(15, 49, W - 30, 16, 2, 2, 'F');
  doc.setTextColor(144, 150, 163);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('CHALLAN NUMBER', 20, 56);
  doc.setTextColor(76, 111, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(challan.challan_number, 20, 62);
  doc.setTextColor(34, 197, 94);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('● ISSUED', W - 20, 62, { align: 'right' });

  // Field helper
  let y = 80;
  const labelColor: [number, number, number] = [91, 96, 112];
  const valueColor: [number, number, number] = [237, 238, 241];
  const sectionBg: [number, number, number] = [18, 21, 27];

  function drawSection(title: string) {
    doc.setFillColor(...sectionBg);
    doc.rect(15, y - 4, W - 30, 8, 'F');
    doc.setTextColor(144, 150, 163);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), 20, y + 1);
    y += 10;
  }

  function drawField(label: string, value: string, isRight = false) {
    const x = isRight ? W / 2 + 5 : 20;
    doc.setTextColor(...labelColor);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text(label, x, y);
    doc.setTextColor(...valueColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(value, x, y + 5.5);
    if (!isRight) y += 14;
  }

  function drawTwoFields(label1: string, val1: string, label2: string, val2: string) {
    drawField(label1, val1, false);
    const savedY = y;
    y -= 14;
    drawField(label2, val2, true);
    y = savedY;
  }

  // Section: Vehicle Details
  drawSection('Vehicle Details');
  drawTwoFields('Registered Plate Number', challan.plate, 'Vehicle Type', challan.vehicle_type);
  drawTwoFields('Dwell Duration', `${challan.dwell_minutes} minutes`, 'Date & Time of Issue', formatDatePDF(challan.issued_at));

  // Section: Violation
  y += 4;
  drawSection('Violation Details');
  drawField('Violation Type', 'Illegal Parking in No-Parking Zone');
  drawTwoFields('Zone / Location', challan.zone, 'Issuing Officer', 'OFF-2024-001');

  // Section: Fine
  y += 4;
  doc.setFillColor(76, 111, 255, 0.15);
  doc.setFillColor(20, 25, 50);
  doc.roundedRect(15, y, W - 30, 18, 2, 2, 'F');
  doc.setDrawColor(76, 111, 255);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, y, W - 30, 18, 2, 2, 'S');
  doc.setTextColor(144, 150, 163);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('FINE AMOUNT', 20, y + 6);
  doc.setTextColor(237, 238, 241);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rs. ${challan.fine_amount}`, 20, y + 14);
  doc.setTextColor(144, 150, 163);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Pay within 30 days to avoid penalty', W - 20, y + 11, { align: 'right' });
  y += 26;

  // SHA-256 integrity block
  y += 4;
  doc.setFillColor(25, 29, 37);
  doc.roundedRect(15, y, W - 30, 28, 2, 2, 'F');
  doc.setTextColor(34, 197, 94);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('TAMPER-EVIDENT SHA-256 HASH', 20, y + 7);
  doc.setTextColor(91, 96, 112);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  // Split hash into two lines
  const half = Math.floor(challan.sha256_hash.length / 2);
  doc.text(challan.sha256_hash.slice(0, half), 20, y + 14);
  doc.text(challan.sha256_hash.slice(half), 20, y + 20);
  y += 36;

  // Verify URL
  doc.setTextColor(76, 111, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Verify online: ${challan.verify_url}`, W / 2, y, { align: 'center' });
  y += 8;

  // Line separator
  doc.setDrawColor(50, 55, 65);
  doc.setLineWidth(0.3);
  doc.line(15, y, W - 15, y);
  y += 8;

  // Footer disclaimer
  doc.setTextColor(91, 96, 112);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.text(
    'This is a digitally generated challan. Any tampering with this document is a punishable offence under Indian law.',
    W / 2,
    y,
    { align: 'center', maxWidth: W - 30 }
  );
  y += 5;
  doc.text(
    `Generated by SmartPark Enforcer on ${new Date().toLocaleString('en-IN')}`,
    W / 2,
    y + 5,
    { align: 'center' }
  );

  // Bottom accent bar
  doc.setFillColor(76, 111, 255);
  doc.rect(0, 285, W, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('MUNICIPAL TRAFFIC ENFORCEMENT AUTHORITY — SmartPark Enforcer System', W / 2, 293, { align: 'center' });

  doc.save(`challan_${challan.challan_number}.pdf`);
}

function formatDatePDF(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  } catch { return iso; }
}

// ─── Step Indicator ──────────────────────────────────────────────────────────

interface StepIndicatorProps {
  current: Step;
}

const STEPS = [
  { id: 1 as Step, label: 'Upload', icon: Upload },
  { id: 2 as Step, label: 'Detect', icon: ScanLine },
  { id: 3 as Step, label: 'Issue', icon: CheckCircle2 },
];

function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0 mb-8 w-full max-w-sm mx-auto">
      {STEPS.map((step, idx) => {
        const done = current > step.id;
        const active = current === step.id;
        const Icon = step.icon;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div
                className={`
                  flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300
                  ${done ? 'bg-[#22C55E] border-[#22C55E] text-white' : ''}
                  ${active ? 'bg-[#4C6FFF] border-[#4C6FFF] text-white shadow-lg shadow-[#4C6FFF]/30' : ''}
                  ${!done && !active ? 'bg-[#191D25] border-white/15 text-[#5B6070]' : ''}
                `}
              >
                {done ? <CheckCircle2 className="w-4.5 h-4.5" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  active ? 'text-[#4C6FFF]' : done ? 'text-[#22C55E]' : 'text-[#5B6070]'
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`flex-1 h-px mx-2 mt-[-16px] transition-colors duration-300 ${
                  current > step.id ? 'bg-[#22C55E]' : 'bg-white/10'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UploadPage() {
  // Step state
  const [step, setStep] = useState<Step>(1);

  // Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [dwellMinutes, setDwellMinutes] = useState<string>('30');
  const [zone, setZone] = useState<string>('Nagaland Main Street No-Parking Zone');
  const [violationType] = useState<string>('Illegal Parking in No-Parking Zone');
  const [officerId] = useState<string>('OFF-2024-001');
  const [notes, setNotes] = useState<string>('');

  // Detection state
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionData | null>(null);

  // Challan state
  const [isIssuing, setIsIssuing] = useState(false);
  const [challanError, setChallanError] = useState<string | null>(null);
  const [challan, setChallan] = useState<ChallanData | null>(null);

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleImageSelect(file: File, url: string) {
    setSelectedFile(file);
    setPreviewUrl(url);
    setDetectionResult(null);
    setDetectionError(null);
    setChallanError(null);
    setChallan(null);
  }

  async function handleDetect() {
    if (!selectedFile) return;
    setIsDetecting(true);
    setDetectionError(null);

    try {
      const fd = new FormData();
      fd.append('image', selectedFile);
      fd.append('dwell_minutes', dwellMinutes || '30');

      const res = await fetch('/api/upload/detect', { method: 'POST', body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Detection failed' }));
        throw new Error(err.error ?? 'Detection failed');
      }
      const data = await res.json();
      setDetectionResult({
        ...data,
        original_image_url: previewUrl,
        dwell_minutes: parseInt(dwellMinutes, 10) || data.dwell_minutes,
      });
      setStep(2);
    } catch (err: unknown) {
      setDetectionError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsDetecting(false);
    }
  }

  async function handleIssueChallan() {
    if (!detectionResult) return;
    setIsIssuing(true);
    setChallanError(null);

    try {
      const res = await fetch('/api/challans/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plate: detectionResult.plate,
          vehicle_type: detectionResult.vehicle_type,
          dwell_minutes: detectionResult.dwell_minutes,
          zone,
          ocr_confidence: detectionResult.confidence,
          officer_id: officerId,
          notes,
          violation_type: violationType,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Challan generation failed' }));
        throw new Error(err.error ?? 'Challan generation failed');
      }
      const data = await res.json();
      setChallan(data);
      setStep(3);
    } catch (err: unknown) {
      setChallanError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsIssuing(false);
    }
  }

  function handleReject() {
    setDetectionResult(null);
    setStep(1);
  }

  function handleNewUpload() {
    setStep(1);
    setSelectedFile(null);
    setPreviewUrl('');
    setDetectionResult(null);
    setChallan(null);
    setDetectionError(null);
    setChallanError(null);
    setDwellMinutes('30');
    setZone('Nagaland Main Street No-Parking Zone');
    setNotes('');
  }

  async function handleDownloadPDF() {
    if (!challan) return;
    await generatePDF(challan);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#EDEEF1]">Upload Evidence &amp; Issue Challan</h1>
        <p className="text-[#9096A3] text-sm">
          Upload a parking violation photo to detect the vehicle and generate a digital challan.
        </p>
      </div>

      {/* Step indicator */}
      <StepIndicator current={step} />

      {/* ── STEP 1: Upload ── */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Image upload */}
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-white/10 bg-[#12151B] p-5">
              <h2 className="text-base font-semibold text-[#EDEEF1] mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#4C6FFF]" />
                Evidence Photo
              </h2>
              <ImageUploadZone onImageSelect={handleImageSelect} disabled={isDetecting} />
            </div>
          </div>

          {/* Right: Form fields */}
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-white/10 bg-[#12151B] p-5 flex flex-col gap-5">
              <h2 className="text-base font-semibold text-[#EDEEF1] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#4C6FFF]" />
                Violation Details
              </h2>

              {/* Dwell Time */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#9096A3] uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  How long was the vehicle parked?
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={480}
                    value={dwellMinutes}
                    onChange={(e) => setDwellMinutes(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-lg bg-[#191D25] border border-white/10 text-[#EDEEF1] text-sm focus:outline-none focus:border-[#4C6FFF]/60 transition-colors"
                    placeholder="30"
                  />
                  <span className="text-sm text-[#9096A3] flex-shrink-0">minutes</span>
                </div>
              </div>

              {/* Zone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#9096A3] uppercase tracking-widest flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  Zone / Location
                </label>
                <input
                  type="text"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="px-3 py-2.5 rounded-lg bg-[#191D25] border border-white/10 text-[#EDEEF1] text-sm focus:outline-none focus:border-[#4C6FFF]/60 transition-colors"
                  placeholder="e.g. Nagaland Main Street No-Parking Zone"
                />
              </div>

              {/* Violation Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#9096A3] uppercase tracking-widest flex items-center gap-1.5">
                  <FileText className="w-3 h-3" />
                  Violation Type
                </label>
                <input
                  type="text"
                  value={violationType}
                  readOnly
                  className="px-3 py-2.5 rounded-lg bg-[#191D25] border border-white/10 text-[#5B6070] text-sm cursor-not-allowed"
                />
              </div>

              {/* Officer ID */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#9096A3] uppercase tracking-widest flex items-center gap-1.5">
                  <User className="w-3 h-3" />
                  Officer ID
                </label>
                <input
                  type="text"
                  value={officerId}
                  readOnly
                  className="px-3 py-2.5 rounded-lg bg-[#191D25] border border-white/10 text-[#5B6070] text-sm cursor-not-allowed"
                />
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#9096A3] uppercase tracking-widest flex items-center gap-1.5">
                  <AlignLeft className="w-3 h-3" />
                  Additional Notes
                  <span className="text-[#5B6070] normal-case tracking-normal">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="px-3 py-2.5 rounded-lg bg-[#191D25] border border-white/10 text-[#EDEEF1] text-sm focus:outline-none focus:border-[#4C6FFF]/60 transition-colors resize-none"
                  placeholder="Any additional observations about the violation..."
                />
              </div>
            </div>

            {/* Detect button */}
            {detectionError && (
              <div className="rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 px-4 py-3 text-sm text-[#EF4444]">
                {detectionError}
              </div>
            )}
            <button
              onClick={handleDetect}
              disabled={!selectedFile || isDetecting}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#4C6FFF] hover:bg-[#3d5ce8] text-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#4C6FFF]/20"
            >
              {isDetecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Image…
                </>
              ) : (
                <>
                  <ScanLine className="w-4 h-4" />
                  Detect Vehicle &amp; Plate
                </>
              )}
            </button>
            {!selectedFile && (
              <p className="text-xs text-[#5B6070] text-center -mt-1">Select an evidence photo to enable detection</p>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 2: Detection Result ── */}
      {step === 2 && detectionResult && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-[#22C55E]/25 bg-[#22C55E]/5 px-4 py-3">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
            <p className="text-sm text-[#22C55E] font-medium">
              Vehicle detected successfully. Review the results below and issue a challan.
            </p>
          </div>
          <DetectionResult
            result={detectionResult}
            onIssueChallan={handleIssueChallan}
            onReject={handleReject}
            isIssuing={isIssuing}
          />
          {challanError && (
            <div className="rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 px-4 py-3 text-sm text-[#EF4444]">
              {challanError}
            </div>
          )}
        </div>
      )}

      {/* ── STEP 3: Challan Preview ── */}
      {step === 3 && challan && (
        <ChallanPreview
          challan={challan}
          onDownloadPDF={handleDownloadPDF}
          onNewUpload={handleNewUpload}
        />
      )}
    </div>
  );
}
