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
    <div className="rounded-xl border border-white/10 bg-[#12151B] overflow-hidden shadow-2xl space-y-0">
      {/* Plate Status Warning/Notice Banner */}
      {!result.isPlateDetected ? (
        <div className="flex items-center gap-2.5 px-5 py-3 bg-red-500/10 border-b border-red-500/30 text-red-400 text-xs font-semibold">
          <EyeOff className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>
            Number plate could not be clearly recognized from this photo. You can manually enter the plate or leave it as &quot;UNREADABLE&quot;.
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between px-5 py-2.5 bg-emerald-500/10 border-b border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Vehicle & License Plate Successfully Recognized
          </span>
          <span className="font-mono bg-emerald-500/20 px-2 py-0.5 rounded text-[11px]">
            {(result.confidence * 100).toFixed(0)}% OCR Confidence
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* LEFT COLUMN: Uploaded Photo Preview (5 cols) */}
        <div className="lg:col-span-5 bg-black flex flex-col justify-between border-r border-white/10 p-4">
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
              Uploaded Violation Photo
            </span>
            <div className="relative rounded-lg overflow-hidden border border-white/20 bg-neutral-900 aspect-video flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.original_image_url}
                alt="Uploaded violation evidence"
                className="w-full h-full object-contain"
              />
              {result.isPlateDetected && (
                <div className="absolute bottom-2 left-2 rounded bg-black/80 backdrop-blur px-2.5 py-1 text-[11px] font-mono text-yellow-400 border border-yellow-400/40">
                  {result.plate}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 text-[11px] text-neutral-400 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Dwell Duration:</span>
              <span className="text-white font-bold">{result.dwell_minutes} Minutes</span>
            </div>
            <div className="flex justify-between">
              <span>Fine Amount:</span>
              <span className="text-white font-bold">₹{result.fine_amount}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Official Challan Fields & Manual Correction (7 cols) */}
        <div className="lg:col-span-7 p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 block font-mono">
                E-Challan Data Verification
              </span>
              <h3 className="text-base font-bold text-white">
                Verify Citizen & Vehicle Details
              </h3>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-200 border border-white/10 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditing ? "Done Editing" : "Edit Details"}
            </button>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* License Plate Field */}
            <div className="p-3 rounded-lg bg-[#191D25] border border-white/10 space-y-1">
              <label className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
                License Plate / Registration No.
              </label>
              {isEditing ? (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={result.plate}
                    onChange={(e) => handleChange("plate", e.target.value.toUpperCase())}
                    className="w-full p-1.5 rounded bg-black/60 border border-white/20 text-yellow-400 font-mono font-bold text-sm focus:outline-none focus:border-blue-500 uppercase"
                  />
                  <label className="flex items-center gap-1.5 text-[10px] text-neutral-300 cursor-pointer">
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
                      className="accent-blue-500"
                    />
                    Mark as &quot;Not Visible / Unreadable&quot;
                  </label>
                </div>
              ) : (
                <div className="text-base font-mono font-black text-yellow-400 tracking-wider">
                  {result.plate}
                </div>
              )}
            </div>

            {/* Vehicle Model & Color */}
            <div className="p-3 rounded-lg bg-[#191D25] border border-white/10 space-y-1">
              <label className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
                Vehicle Make & Model
              </label>
              {isEditing ? (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={result.vehicle_make}
                    onChange={(e) => handleChange("vehicle_make", e.target.value)}
                    placeholder="Make (e.g. MARUTI SUZUKI)"
                    className="w-1/2 p-1.5 rounded bg-black/60 border border-white/20 text-white font-medium text-xs uppercase"
                  />
                  <input
                    type="text"
                    value={result.vehicle_model}
                    onChange={(e) => handleChange("vehicle_model", e.target.value)}
                    placeholder="Model (e.g. SWIFT DZIRE)"
                    className="w-1/2 p-1.5 rounded bg-black/60 border border-white/20 text-white font-medium text-xs uppercase"
                  />
                </div>
              ) : (
                <div className="text-xs font-bold text-white">
                  {result.vehicle_make} {result.vehicle_model} ({result.vehicle_color})
                </div>
              )}
            </div>

            {/* Owner Name */}
            <div className="p-3 rounded-lg bg-[#191D25] border border-white/10 space-y-1">
              <label className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
                Registered Owner Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={result.owner_name}
                  onChange={(e) => handleChange("owner_name", e.target.value)}
                  className="w-full p-1.5 rounded bg-black/60 border border-white/20 text-white font-medium text-xs uppercase"
                />
              ) : (
                <div className="text-xs font-bold text-white">
                  {result.owner_name}
                </div>
              )}
            </div>

            {/* Father/Husband Name */}
            <div className="p-3 rounded-lg bg-[#191D25] border border-white/10 space-y-1">
              <label className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
                Father / Husband Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={result.parent_name}
                  onChange={(e) => handleChange("parent_name", e.target.value)}
                  className="w-full p-1.5 rounded bg-black/60 border border-white/20 text-white font-medium text-xs uppercase"
                />
              ) : (
                <div className="text-xs font-bold text-white">
                  {result.parent_name}
                </div>
              )}
            </div>

            {/* Violation Location */}
            <div className="sm:col-span-2 p-3 rounded-lg bg-[#191D25] border border-white/10 space-y-1">
              <label className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
                Location of Violation
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={result.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="w-full p-1.5 rounded bg-black/60 border border-white/20 text-white font-medium text-xs uppercase"
                />
              ) : (
                <div className="text-xs font-bold text-neutral-200">
                  {result.location}
                </div>
              )}
            </div>

            {/* Owner Address */}
            <div className="sm:col-span-2 p-3 rounded-lg bg-[#191D25] border border-white/10 space-y-1">
              <label className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
                Registered Residential Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={result.owner_address}
                  onChange={(e) => handleChange("owner_address", e.target.value)}
                  className="w-full p-1.5 rounded bg-black/60 border border-white/20 text-white font-medium text-xs uppercase"
                />
              ) : (
                <div className="text-xs font-medium text-neutral-300">
                  {result.owner_address}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3 border-t border-white/10">
            <button
              onClick={onIssueChallan}
              disabled={isIssuing}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg disabled:opacity-50"
            >
              {isIssuing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Official E-Challan…
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
              className="flex items-center gap-1.5 px-4 py-3 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 font-semibold text-xs transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Re-select Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
