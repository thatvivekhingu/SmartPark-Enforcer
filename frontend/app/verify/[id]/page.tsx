import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import OfficialGovernmentChallan from "@/components/challan/OfficialGovernmentChallan";

interface PageProps {
  params: { id: string };
}

export default function ChallanVerifyPage({ params }: PageProps) {
  const { id } = params;

  const challanData = {
    challanNumber: id || "GJ01TP5892615",
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
    <div className="min-h-screen bg-[#0B0D12] text-[#EDEEF1] flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-[#12151B]/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
              GJ
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                Government of India · Traffic Police E-Challan Portal
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-mono font-semibold">
                  <ShieldCheck className="h-3 w-3" /> VERIFIED AUTHENTIC
                </span>
              </div>
              <div className="text-[10px] text-neutral-400 font-mono">
                Cryptographically Signed by Parivahan MoRTH Registry
              </div>
            </div>
          </div>

          <Link
            href="/overview"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Portal Home
          </Link>
        </div>
      </header>

      {/* Main Verification Body */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-6">
        <OfficialGovernmentChallan {...challanData} />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#12151B] py-4 text-center text-xs text-neutral-500">
        Official Government Electronic Traffic Penalty System · Ministry of Road Transport & Highways
      </footer>
    </div>
  );
}
