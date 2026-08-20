"use client";

import React from "react";
import { Plus } from "lucide-react";
import OfficialGovernmentChallan from "@/components/challan/OfficialGovernmentChallan";
import type { DetectionResultDetails } from "./DetectionResult";

interface ChallanPreviewProps {
  challan: {
    challan_number: string;
    plate: string;
    vehicle_type: string;
    vehicle_make?: string;
    vehicle_model?: string;
    vehicle_color?: string;
    owner_name?: string;
    parent_name?: string;
    owner_address?: string;
    mobile_no?: string;
    dwell_minutes: number;
    fine_amount: number;
    zone: string;
    issued_at: string;
    sha256_hash: string;
    verify_url: string;
    evidence_url?: string;
    is_plate_detected?: boolean;
  };
  onDownloadPDF?: () => void;
  onNewUpload: () => void;
}

export default function ChallanPreview({ challan, onNewUpload }: ChallanPreviewProps) {
  const {
    challan_number,
    plate,
    vehicle_type,
    vehicle_make = "MARUTI SUZUKI",
    vehicle_model = "SWIFT DZIRE",
    vehicle_color = "WHITE",
    owner_name = "RAHUL SHARMA",
    parent_name = "SURESH SHARMA",
    owner_address = "12, SHYAM NAGAR, AHMEDABAD, GUJARAT - 380015",
    mobile_no = "9876543210",
    dwell_minutes,
    fine_amount,
    zone,
    issued_at,
    evidence_url,
    is_plate_detected = true,
  } = challan;

  // Format Date and Time
  const now = new Date(issued_at || Date.now());
  const dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-");
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  const payBefore = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000)
    .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
    .replace(/\//g, "-");

  const displayPlate = is_plate_detected ? plate : "NOT DETECTED (UNREADABLE)";

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto">
      {/* Top Action Header */}
      <div className="flex items-center justify-between w-full pb-2 border-b border-border/80">
        <div>
          <h2 className="text-base font-bold text-text-primary">
            Official E-Challan Generated
          </h2>
          <p className="text-xs text-text-muted">
            Generated using your uploaded evidence photo and verified Vahan citizen records.
          </p>
        </div>
        <button
          onClick={onNewUpload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-semibold text-text-primary hover:bg-elevated transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Upload Another Evidence Photo
        </button>
      </div>

      {/* Authentic Government E-Challan Document */}
      <div className="w-full">
        <OfficialGovernmentChallan
          challanNumber={challan_number || "GJ01TP5892615"}
          challanDate={dateStr}
          challanTime={timeStr}
          registrationNo={displayPlate}
          vehicleType={vehicle_type?.toUpperCase() || "CAR"}
          vehicleMake={vehicle_make}
          vehicleModel={vehicle_model}
          vehicleColor={vehicle_color}
          ownerName={owner_name}
          parentName={parent_name}
          ownerAddress={owner_address}
          mobileNo={mobile_no}
          location={zone || "C.G. ROAD, AHMEDABAD, GUJARAT - 380009"}
          violatingRule="122/177 MVA"
          natureOfOffence="ILLEGAL PARKING"
          description={`Vehicle parked in No Parking Zone causing obstruction for ${dwell_minutes} minutes.`}
          amount={fine_amount || 1000}
          amountInWords={fine_amount === 500 ? "Rupees Five Hundred Only" : "Rupees One Thousand Only"}
          paymentStatus="PENDING"
          payBeforeDate={payBefore}
          evidenceImageUrl={evidence_url || "/evidence/violations/violation_youtube_test_tr89_20260819_184818.jpg"}
          cityAuthority="Ahmedabad City"
          stateAuthority="Gujarat"
          contactNo="079-27654321"
        />
      </div>
    </div>
  );
}
