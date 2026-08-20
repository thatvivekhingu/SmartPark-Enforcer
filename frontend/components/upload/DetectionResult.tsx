'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, Car, Clock, IndianRupee, Loader2, XCircle } from 'lucide-react';

interface DetectionResultProps {
  result: {
    plate: string;
    confidence: number;
    vehicle_type: string;
    dwell_minutes: number;
    annotated_image_url?: string;
    original_image_url: string;
  };
  onIssueChallan: () => void;
  onReject: () => void;
  isIssuing: boolean;
}

function confidenceColor(c: number): string {
  if (c >= 0.85) return '#22C55E';
  if (c >= 0.65) return '#F59E0B';
  return '#EF4444';
}

function confidenceLabel(c: number): string {
  if (c >= 0.85) return 'High';
  if (c >= 0.65) return 'Medium';
  return 'Low';
}

function formatDwell(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m} minute${m !== 1 ? 's' : ''}`;
}

const VEHICLE_TYPE_LABELS: Record<string, string> = {
  car: 'Car / SUV',
  motorcycle: 'Motorcycle / Scooter',
  truck: 'Truck / HGV',
  bus: 'Bus',
  auto: 'Auto Rickshaw',
};

export default function DetectionResult({
  result,
  onIssueChallan,
  onReject,
  isIssuing,
}: DetectionResultProps) {
  const { plate, confidence, vehicle_type, dwell_minutes, annotated_image_url, original_image_url } = result;
  const color = confidenceColor(confidence);
  const pct = Math.round(confidence * 100);
  const lowConfidence = confidence < 0.80;
  const imageToShow = annotated_image_url ?? original_image_url;

  return (
    <div className="rounded-xl border border-white/10 bg-[#12151B] overflow-hidden">
      {/* Low confidence warning */}
      {lowConfidence && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-[#F59E0B]/10 border-b border-[#F59E0B]/30">
          <AlertTriangle className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
          <p className="text-[#F59E0B] text-sm font-medium">
            Low OCR confidence — verify plate manually before issuing challan.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* LEFT — Evidence image */}
        <div className="relative bg-black/40 flex items-center justify-center min-h-[280px] border-r border-white/7">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageToShow}
            alt="Evidence photo with detection overlay"
            className="w-full h-full object-contain"
            style={{ maxHeight: '360px' }}
          />
          {/* Simulated bounding box overlay */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: '22%',
              top: '52%',
              width: '56%',
              height: '18%',
              border: '2px solid #4C6FFF',
              borderRadius: '4px',
              boxShadow: '0 0 0 1px rgba(76,111,255,0.3)',
            }}
          >
            <span className="absolute -top-5 left-0 text-[10px] font-bold text-[#4C6FFF] bg-black/70 px-1 rounded">
              PLATE
            </span>
          </div>
          <div className="absolute bottom-2 left-2 text-[10px] text-[#9096A3] bg-black/60 px-2 py-0.5 rounded">
            Detection overlay (simulated)
          </div>
        </div>

        {/* RIGHT — Detection details */}
        <div className="p-6 flex flex-col gap-5">
          {/* Detected Plate */}
          <div>
            <p className="text-xs text-[#5B6070] uppercase tracking-widest mb-1">Detected Plate</p>
            <span className="font-mono text-3xl font-bold text-[#F59E0B] tracking-widest">{plate}</span>
          </div>

          {/* Confidence */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs text-[#5B6070] uppercase tracking-widest">OCR Confidence</p>
              <span className="text-sm font-semibold" style={{ color }}>
                {pct}% — {confidenceLabel(confidence)}
              </span>
            </div>
            <div className="h-2 w-full bg-[#191D25] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#5B6070] uppercase tracking-widest">Vehicle Type</p>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4C6FFF]/15 border border-[#4C6FFF]/30 text-[#4C6FFF] text-sm font-medium">
              <Car className="w-3.5 h-3.5" />
              {VEHICLE_TYPE_LABELS[vehicle_type] ?? vehicle_type}
            </span>
          </div>

          {/* Dwell Duration */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#5B6070] uppercase tracking-widest">Dwell Duration</p>
            <span className="flex items-center gap-1.5 text-[#EDEEF1] text-sm font-medium">
              <Clock className="w-3.5 h-3.5 text-[#9096A3]" />
              {formatDwell(dwell_minutes)}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-white/7" />

          {/* Estimated Fine */}
          <div className="flex items-center justify-between rounded-lg bg-[#191D25] px-4 py-3 border border-white/10">
            <div>
              <p className="text-xs text-[#5B6070] uppercase tracking-widest mb-0.5">Estimated Fine</p>
              <p className="text-xs text-[#9096A3]">Illegal Parking in No-Parking Zone</p>
            </div>
            <span className="flex items-center gap-1 text-2xl font-bold text-[#EDEEF1]">
              <IndianRupee className="w-5 h-5" />
              500
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-auto">
            <button
              onClick={onIssueChallan}
              disabled={isIssuing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#4C6FFF] hover:bg-[#3d5ce8] text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isIssuing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Issuing…
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Issue Challan
                </>
              )}
            </button>
            <button
              onClick={onReject}
              disabled={isIssuing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#EF4444]/50 text-[#EF4444] hover:bg-[#EF4444]/10 font-semibold text-sm transition-colors disabled:opacity-60"
            >
              <XCircle className="w-4 h-4" />
              Re-detect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
