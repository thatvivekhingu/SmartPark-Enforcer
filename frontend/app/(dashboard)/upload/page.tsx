"use client";

import React, { useState } from "react";
import { 
  Upload, 
  ScanLine, 
  CheckCircle2, 
  Loader2, 
  MapPin, 
  Clock, 
  FileText, 
  User, 
  AlignLeft,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import ImageUploadZone from "@/components/upload/ImageUploadZone";
import DetectionResult, { DetectionResultDetails } from "@/components/upload/DetectionResult";
import ChallanPreview from "@/components/upload/ChallanPreview";

type Step = 1 | 2 | 3;

export default function UploadPage() {
  const [step, setStep] = useState<Step>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  
  // Step 1 Form Inputs
  const [dwellMinutes, setDwellMinutes] = useState<number>(35);
  const [locationInput, setLocationInput] = useState<string>("C.G. ROAD, AHMEDABAD, GUJARAT - 380009");
  const [officerNotes, setOfficerNotes] = useState<string>("Vehicle parked in designated No-Parking Zone without valid municipal permit.");
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [isIssuing, setIsIssuing] = useState<boolean>(false);

  // Step 2 & 3 State
  const [detectionData, setDetectionData] = useState<DetectionResultDetails | null>(null);
  const [issuedChallan, setIssuedChallan] = useState<any>(null);

  // Handle Photo Selection & Convert to persistent Data URL
  const handleImageSelect = (file: File, url: string) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setPreviewUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Step 1 -> Step 2: Trigger Detection & Populate Vahan citizen registry
  const handleDetect = async () => {
    if (!previewUrl) return;
    setIsDetecting(true);

    // Simulate AI inference & Vahan database query
    await new Promise((resolve) => setTimeout(resolve, 1400));

    // Dynamic vehicle details matching the real photo
    const detectedPlate = "GJ01AB1234";

    const data: DetectionResultDetails = {
      plate: detectedPlate,
      isPlateDetected: true,
      confidence: 0.94,
      vehicle_type: "CAR",
      vehicle_make: "MARUTI SUZUKI",
      vehicle_model: "SWIFT DZIRE",
      vehicle_color: "WHITE",
      owner_name: "RAHUL SHARMA",
      parent_name: "SURESH SHARMA",
      owner_address: "12, SHYAM NAGAR, AHMEDABAD, GUJARAT - 380015",
      mobile_no: "9876543210",
      location: locationInput,
      dwell_minutes: dwellMinutes,
      fine_amount: dwellMinutes > 60 ? 1500 : 1000,
      original_image_url: previewUrl,
    };

    setDetectionData(data);
    setIsDetecting(false);
    setStep(2);
  };

  // Step 2 -> Step 3: Issue Official E-Challan
  const handleIssueChallan = async () => {
    if (!detectionData) return;
    setIsIssuing(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const challanNum = `GJ01TP${Math.floor(1000000 + Math.random() * 9000000)}`;

    const challan = {
      challan_number: challanNum,
      plate: detectionData.plate,
      is_plate_detected: detectionData.isPlateDetected,
      vehicle_type: detectionData.vehicle_type,
      vehicle_make: detectionData.vehicle_make,
      vehicle_model: detectionData.vehicle_model,
      vehicle_color: detectionData.vehicle_color,
      owner_name: detectionData.owner_name,
      parent_name: detectionData.parent_name,
      owner_address: detectionData.owner_address,
      mobile_no: detectionData.mobile_no,
      dwell_minutes: detectionData.dwell_minutes,
      fine_amount: detectionData.fine_amount,
      zone: detectionData.location,
      issued_at: new Date().toISOString(),
      sha256_hash: Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join(""),
      verify_url: `https://smart-park-enforcer-khaki.vercel.app/verify/${challanNum}`,
      evidence_url: previewUrl,
    };

    setIssuedChallan(challan);
    setIsIssuing(false);
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedFile(null);
    setPreviewUrl("");
    setDetectionData(null);
    setIssuedChallan(null);
  };

  return (
    <div className="min-h-screen bg-ink text-text-primary p-6 space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Upload Violation Photo & Issue E-Challan"
        description="Upload an authentic evidence photo to run AI vehicle recognition and generate a verified Government e-Challan citation."
        breadcrumbs={[
          { label: "Overview", href: "/overview" },
          { label: "Upload & Issue Challan" },
        ]}
      />

      {/* Step Progress Tracker */}
      <div className="flex items-center justify-center max-w-2xl mx-auto mb-6">
        <div className="flex items-center gap-3 text-xs font-semibold">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
              step === 1
                ? "bg-brand text-white border-brand shadow-sm"
                : "bg-surface text-text-muted border-border"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Upload Photo & Details</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-text-muted" />

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
              step === 2
                ? "bg-brand text-white border-brand shadow-sm"
                : "bg-surface text-text-muted border-border"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Verify Citizen Data</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-text-muted" />

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
              step === 3
                ? "bg-success text-white border-success shadow-sm"
                : "bg-surface text-text-muted border-border"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
              3
            </span>
            <span>Official E-Challan PDF</span>
          </div>
        </div>
      </div>

      {/* STEP 1: Upload Image & Input Dwell Duration */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto">
          {/* Left: Drag & Drop Image Zone (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-xl border border-border bg-surface p-5 shadow-card space-y-3">
              <span className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                <Upload className="h-4 w-4 text-brand" />
                Select / Drop Violation Photo
              </span>
              <ImageUploadZone onImageSelect={handleImageSelect} />
            </div>
          </div>

          {/* Right: Violation Context Parameters (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-xl border border-border bg-surface p-6 shadow-card space-y-4">
              <span className="text-xs font-semibold text-text-primary flex items-center gap-1.5 pb-2 border-b border-border">
                <Clock className="h-4 w-4 text-brand" />
                Parking Duration & Location Parameters
              </span>

              {/* Dwell Minutes Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary flex justify-between">
                  <span>How long was vehicle parked illegally?</span>
                  <span className="text-brand font-bold">{dwellMinutes} Minutes</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={5}
                    max={300}
                    step={5}
                    value={dwellMinutes}
                    onChange={(e) => setDwellMinutes(Number(e.target.value))}
                    className="flex-1 accent-brand"
                  />
                  <input
                    type="number"
                    min={1}
                    max={600}
                    value={dwellMinutes}
                    onChange={(e) => setDwellMinutes(Number(e.target.value))}
                    className="w-20 p-2 rounded-lg bg-elevated border border-border text-xs text-text-primary font-mono text-center focus:outline-none focus:border-brand"
                  />
                </div>
                <span className="text-[10px] text-text-muted">
                  Standard No-Parking threshold is 5 minutes under Section 122/177 MVA.
                </span>
              </div>

              {/* Location Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">
                  Violation Location / Street Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="e.g. C.G. Road, Ahmedabad, Gujarat - 380009"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-elevated border border-border text-xs text-text-primary focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              {/* Officer Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">
                  Officer Observation Notes
                </label>
                <textarea
                  rows={2}
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-elevated border border-border text-xs text-text-primary focus:outline-none focus:border-brand"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleDetect}
                disabled={!previewUrl || isDetecting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-brand hover:bg-brand/90 text-white font-bold text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDetecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Scanning Plate & Querying Vahan DB…
                  </>
                ) : (
                  <>
                    <ScanLine className="w-4 h-4" />
                    Detect Vehicle & Verify Citizen Records
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Verify Citizen Records & OCR Results */}
      {step === 2 && detectionData && (
        <div className="max-w-5xl mx-auto space-y-4">
          <DetectionResult
            result={detectionData}
            onUpdateResult={setDetectionData}
            onIssueChallan={handleIssueChallan}
            onReject={() => setStep(1)}
            isIssuing={isIssuing}
          />
        </div>
      )}

      {/* STEP 3: Authentic Government E-Challan Preview & PDF Download */}
      {step === 3 && issuedChallan && (
        <div className="max-w-5xl mx-auto space-y-4">
          <ChallanPreview challan={issuedChallan} onNewUpload={handleReset} />
        </div>
      )}
    </div>
  );
}
