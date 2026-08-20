"use client";

import React, { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  Car, 
  Clock, 
  IndianRupee, 
  Loader2, 
  XCircle, 
  Edit3, 
  ShieldCheck, 
  EyeOff,
  User,
  MapPin,
  FileText
} from "lucide-react";

export interface DetectionResultDetails {
  plate: string;
  isPlateDetected: boolean;
  confidence: number;
  vehicle_type: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_color: string;
  owner_name: string;
  parent_name: string;
  owner_address: string;
  mobile_no: string;
  location: string;
  dwell_minutes: number;
  fine_amount: number;
  original_image_url: string;
}

interface DetectionResultProps {
  result: DetectionResultDetails;
  onUpdateResult: (updated: DetectionResultDetails) => void;
  onIssueChallan: () => void;
  onReject: () => void;
  isIssuing: boolean;
}

export default function DetectionResult({
  result,
  onUpdateResult,
  onIssueChallan,
  onReject,
  isIssuing,
}: DetectionResultProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field: keyof DetectionResultDetails, val: any) => {
    onUpdateResult({
      ...result,
      [field]: val,
    });
  };

  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-0 text-[#1d1d1f]">
      {/* Plate Status Warning/Notice Banner */}
      {!result.isPlateDetected ? (
        <div className="flex items-center gap-2.5 px-6 py-3 bg-[#ff3b30]/10 border-b border-[#ff3b30]/20 text-[#c72820] text-xs font-semibold">
          <EyeOff className="w-4 h-4 text-[#ff3b30] flex-shrink-0" />
          <span>
            Number plate could not be automatically detected. You can manually enter the registration plate below.
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between px-6 py-3 bg-[#34c759]/10 border-b border-[#34c759]/20 text-[#1e7e34] text-xs font-semibold">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#34c759]" />
            Vehicle & License Plate Successfully Recognized
          </span>
          <span className="font-mono bg-[#34c759]/20 px-2 py-0.5 rounded text-[11px]">
            {(result.confidence * 100).toFixed(0)}% OCR Confidence
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* LEFT COLUMN: Uploaded Photo Preview (5 cols) */}
        <div className="lg:col-span-5 bg-black/[0.02] flex flex-col justify-between border-r border-black/[0.06] p-6">
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block">
              Uploaded Violation Photo
            </span>
            <div className="relative rounded-xl overflow-hidden border border-black/[0.08] bg-black aspect-video flex items-center justify-center shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.original_image_url}
                alt="Uploaded violation evidence"
                className="w-full h-full object-contain"
              />
              {result.isPlateDetected && (
                <div className="absolute bottom-2 left-2 rounded-lg bg-black/80 backdrop-blur px-2.5 py-1 text-xs font-mono font-bold text-white border border-white/20">
                  {result.plate}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-black/[0.06] text-xs text-[#6e6e73] space-y-1.5 font-medium">
            <div className="flex justify-between">
              <span>Dwell Duration:</span>
              <span className="text-[#1d1d1f] font-semibold">{result.dwell_minutes} Minutes</span>
            </div>
            <div className="flex justify-between">
              <span>Fine Amount:</span>
              <span className="text-[#1d1d1f] font-semibold">₹{result.fine_amount}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Official Challan Fields & Manual Correction (7 cols) */}
        <div className="lg:col-span-7 p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#86868b] block font-semibold">
                Verification Step
              </span>
              <h3 className="text-base font-semibold text-[#1d1d1f]">
                Verify Citizen & Vehicle Details
              </h3>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-xs font-semibold text-[#1d1d1f] transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditing ? "Done" : "Edit Fields"}
            </button>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            {/* License Plate Field */}
            <div className="p-3.5 rounded-xl bg-black/[0.02] border border-black/[0.06] space-y-1">
              <label className="text-[11px] text-[#86868b] uppercase tracking-wider block font-semibold">
                License Plate Number
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={result.plate}
                    onChange={(e) => handleChange("plate", e.target.value.toUpperCase())}
                    className="w-full p-2 rounded-lg bg-white border border-black/[0.12] text-[#1d1d1f] font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 uppercase"
                  />
                  <label className="flex items-center gap-1.5 text-xs text-[#6e6e73] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!result.isPlateDetected}
                      onChange={(e) => {
                        const notDetected = e.target.checked;
                        onUpdateResult({
                          ...result,
                          isPlateDetected: !notDetected,
                          plate: notDetected ? "NOT DETECTED" : "GJ01AB1234",
                        });
                      }}
                      className="accent-[#0071e3]"
                    />
                    Mark as &quot;Unreadable / Obscured&quot;
                  </label>
                </div>
              ) : (
                <div className="text-base font-mono font-bold text-[#0071E3] tracking-wide">
                  {result.plate}
                </div>
              )}
            </div>

            {/* Vehicle Model & Color */}
            <div className="p-3.5 rounded-xl bg-black/[0.02] border border-black/[0.06] space-y-1">
              <label className="text-[11px] text-[#86868b] uppercase tracking-wider block font-semibold">
                Vehicle Make & Model
              </label>
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={result.vehicle_make}
                    onChange={(e) => handleChange("vehicle_make", e.target.value)}
                    placeholder="Make"
                    className="w-1/2 p-2 rounded-lg bg-white border border-black/[0.12] text-[#1d1d1f] font-medium text-xs uppercase"
                  />
                  <input
                    type="text"
                    value={result.vehicle_model}
                    onChange={(e) => handleChange("vehicle_model", e.target.value)}
                    placeholder="Model"
                    className="w-1/2 p-2 rounded-lg bg-white border border-black/[0.12] text-[#1d1d1f] font-medium text-xs uppercase"
                  />
                </div>
              ) : (
                <div className="text-xs font-semibold text-[#1d1d1f]">
                  {result.vehicle_make} {result.vehicle_model} ({result.vehicle_color})
                </div>
              )}
            </div>

            {/* Owner Name */}
            <div className="p-3.5 rounded-xl bg-black/[0.02] border border-black/[0.06] space-y-1">
              <label className="text-[11px] text-[#86868b] uppercase tracking-wider block font-semibold">
                Registered Owner Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={result.owner_name}
                  onChange={(e) => handleChange("owner_name", e.target.value)}
                  className="w-full p-2 rounded-lg bg-white border border-black/[0.12] text-[#1d1d1f] font-medium text-xs uppercase"
                />
              ) : (
                <div className="text-xs font-semibold text-[#1d1d1f]">
                  {result.owner_name}
                </div>
              )}
            </div>

            {/* Father/Husband Name */}
            <div className="p-3.5 rounded-xl bg-black/[0.02] border border-black/[0.06] space-y-1">
              <label className="text-[11px] text-[#86868b] uppercase tracking-wider block font-semibold">
                Father / Husband Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={result.parent_name}
                  onChange={(e) => handleChange("parent_name", e.target.value)}
                  className="w-full p-2 rounded-lg bg-white border border-black/[0.12] text-[#1d1d1f] font-medium text-xs uppercase"
                />
              ) : (
                <div className="text-xs font-semibold text-[#1d1d1f]">
                  {result.parent_name}
                </div>
              )}
            </div>

            {/* Violation Location */}
            <div className="sm:col-span-2 p-3.5 rounded-xl bg-black/[0.02] border border-black/[0.06] space-y-1">
              <label className="text-[11px] text-[#86868b] uppercase tracking-wider block font-semibold">
                Location of Violation
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={result.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="w-full p-2 rounded-lg bg-white border border-black/[0.12] text-[#1d1d1f] font-medium text-xs uppercase"
                />
              ) : (
                <div className="text-xs font-medium text-[#1d1d1f]">
                  {result.location}
                </div>
              )}
            </div>

            {/* Owner Address */}
            <div className="sm:col-span-2 p-3.5 rounded-xl bg-black/[0.02] border border-black/[0.06] space-y-1">
              <label className="text-[11px] text-[#86868b] uppercase tracking-wider block font-semibold">
                Registered Residential Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={result.owner_address}
                  onChange={(e) => handleChange("owner_address", e.target.value)}
                  className="w-full p-2 rounded-lg bg-white border border-black/[0.12] text-[#1d1d1f] font-medium text-xs uppercase"
                />
              ) : (
                <div className="text-xs font-medium text-[#6e6e73]">
                  {result.owner_address}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-black/[0.06]">
            <button
              onClick={onIssueChallan}
              disabled={isIssuing}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-sm transition-all shadow-sm disabled:opacity-50"
            >
              {isIssuing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating E-Challan…
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Generate Official E-Challan PDF
                </>
              )}
            </button>

            <button
              onClick={onReject}
              disabled={isIssuing}
              className="flex items-center gap-1.5 px-4 py-3 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#1d1d1f] font-semibold text-xs transition-colors"
            >
              <XCircle className="w-4 h-4 text-[#86868b]" />
              Choose Another Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
