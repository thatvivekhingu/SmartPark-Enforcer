"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldCheck, Printer } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import OfficialGovernmentChallan from "@/components/challan/OfficialGovernmentChallan";

export default function ChallanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params.id as string) || "1";

  const challanData = {
    challanNumber: `GJ01TP589261${id}`,
    challanDate: "20-06-2025",
    challanTime: "11:25 AM",
    registrationNo: "GJ01AB1234",
    vehicleType: "CAR",
    vehicleMake: "MARUTI SUZUKI",
    vehicleModel: "SWIFT DZIRE",
    vehicleColor: "WHITE",
    ownerName: "RAHUL SHARMA",
    parentName: "SURESH SHARMA",
    ownerAddress: "12, SHYAM NAGAR, AHMEDABAD, GUJARAT - 380015",
    mobileNo: "9876543210",
    location: "C.G. ROAD, AHMEDABAD, GUJARAT - 380009",
    violatingRule: "122/177 MVA",
    natureOfOffence: "ILLEGAL PARKING",
    description: "Vehicle parked in No Parking Zone causing obstruction.",
    amount: 1000,
    amountInWords: "Rupees One Thousand Only",
    paymentStatus: "PENDING" as const,
    payBeforeDate: "05-07-2025",
    evidenceImageUrl: "/evidence/violations/violation_youtube_test_tr89_20260819_184818.jpg",
    cityAuthority: "Ahmedabad City",
    stateAuthority: "Gujarat",
    contactNo: "079-27654321",
  };

  return (
    <div className="min-h-screen bg-ink text-text-primary p-6 space-y-6">
      {/* Top Header */}
      <PageHeader
        title={`E-Challan ${challanData.challanNumber}`}
        description="Official Government of India Traffic Police e-Challan Citation"
        breadcrumbs={[
          { label: "Overview", href: "/overview" },
          { label: "Challans", href: "/challans" },
          { label: challanData.challanNumber }
        ]}
        actions={
          <button
            onClick={() => router.push("/challans")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Challans
          </button>
        }
      />

      {/* Official Authentic Government e-Challan Document */}
      <OfficialGovernmentChallan {...challanData} />
    </div>
  );
}
