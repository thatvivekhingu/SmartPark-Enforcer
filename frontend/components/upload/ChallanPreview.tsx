'use client';

import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { CheckCircle2, Download, Plus, ExternalLink, Shield } from 'lucide-react';

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

interface ChallanPreviewProps {
  challan: ChallanData;
  onDownloadPDF: () => void;
  onNewUpload: () => void;
}

function formatDwell(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m} minute${m !== 1 ? 's' : ''}`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return iso;
  }
}

const VEHICLE_TYPE_LABELS: Record<string, string> = {
  car: 'Car / SUV',
  motorcycle: 'Motorcycle / Scooter',
  truck: 'Truck / HGV',
  bus: 'Bus',
  auto: 'Auto Rickshaw',
};

function ChallanField({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-[#5B6070] uppercase tracking-widest">{label}</span>
      <span className={`text-sm text-[#EDEEF1] ${mono ? 'font-mono break-all' : 'font-medium'}`}>{value}</span>
    </div>
  );
}

export default function ChallanPreview({ challan, onDownloadPDF, onNewUpload }: ChallanPreviewProps) {
  const {
    challan_number,
    plate,
    vehicle_type,
    dwell_minutes,
    fine_amount,
    zone,
    issued_at,
    sha256_hash,
    verify_url,
  } = challan;

  return (
    <div className="flex flex-col items-center gap-6 max-w-xl mx-auto w-full">
      {/* Success header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30">
          <CheckCircle2 className="w-9 h-9 text-[#22C55E]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#EDEEF1]">Challan Issued Successfully</h2>
          <p className="text-[#9096A3] text-sm mt-1">
            Digital challan has been generated and recorded.
          </p>
        </div>
      </div>

      {/* Challan card */}
      <div className="w-full rounded-xl border border-white/10 bg-[#12151B] overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/7 bg-[#191D25]">
          <div>
            <p className="text-xs text-[#5B6070] uppercase tracking-widest mb-0.5">Challan No.</p>
            <p className="font-mono text-base font-bold text-[#4C6FFF] tracking-wider">{challan_number}</p>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-xs font-semibold uppercase">
            <Shield className="w-3 h-3" />
            Issued
          </span>
        </div>

        {/* Fields grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-5">
          <ChallanField label="Vehicle Plate" value={plate} mono />
          <ChallanField label="Vehicle Type" value={VEHICLE_TYPE_LABELS[vehicle_type] ?? vehicle_type} />
          <ChallanField label="Dwell Duration" value={formatDwell(dwell_minutes)} />
          <ChallanField label="Issued At" value={formatDate(issued_at)} />
          <div className="col-span-2">
            <ChallanField label="Zone / Location" value={zone} />
          </div>
          <div className="col-span-2">
            <ChallanField label="Violation" value="Illegal Parking in No-Parking Zone" />
          </div>
        </div>

        {/* Fine */}
        <div className="mx-5 mb-5 flex items-center justify-between rounded-lg bg-[#4C6FFF]/10 border border-[#4C6FFF]/25 px-4 py-3">
          <span className="text-sm font-semibold text-[#EDEEF1]">Fine Amount</span>
          <span className="text-xl font-bold text-[#EDEEF1]">₹{fine_amount}</span>
        </div>

        {/* Integrity block */}
        <div className="mx-5 mb-5 rounded-lg bg-[#191D25] border border-white/7 p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-3.5 h-3.5 text-[#22C55E]" />
            <span className="text-xs font-semibold text-[#22C55E] uppercase tracking-widest">Tamper-Evident Hash</span>
          </div>
          <p className="font-mono text-[10px] text-[#9096A3] break-all leading-relaxed">{sha256_hash}</p>
        </div>

        {/* QR placeholder */}
        <div className="mx-5 mb-5 rounded-lg border border-dashed border-white/15 p-4 flex flex-col items-center gap-3">
          {/* Simulated QR grid */}
          <div
            className="w-24 h-24 rounded bg-white flex items-center justify-center text-[#0B0D12] text-[8px] font-bold text-center leading-tight p-1"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg,#0B0D12 0px,#0B0D12 3px,transparent 3px,transparent 6px), repeating-linear-gradient(90deg,#0B0D12 0px,#0B0D12 3px,transparent 3px,transparent 6px)',
              backgroundSize: '6px 6px',
            }}
          >
            <span className="bg-white px-1 py-0.5 rounded text-center">QR CODE</span>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#9096A3] mb-1">Scan to verify this challan online</p>
            <a
              href={verify_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#4C6FFF] text-xs hover:underline break-all"
            >
              {verify_url}
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full">
        <button
          onClick={onDownloadPDF}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#4C6FFF] hover:bg-[#3d5ce8] text-white font-semibold text-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        <button
          onClick={onNewUpload}
          className="flex items-center gap-2 px-5 py-3 rounded-lg border border-white/15 bg-transparent text-[#EDEEF1] hover:bg-[#191D25] font-semibold text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Challan
        </button>
      </div>
    </div>
  );
}
