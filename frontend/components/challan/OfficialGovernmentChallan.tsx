"use client";

import React, { useRef } from "react";
import { Download, Printer, Share2, CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface OfficialChallanProps {
  challanNumber?: string;
  challanDate?: string;
  challanTime?: string;
  registrationNo?: string;
  vehicleType?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  ownerName?: string;
  parentName?: string;
  ownerAddress?: string;
  mobileNo?: string;
  location?: string;
  violatingRule?: string;
  natureOfOffence?: string;
  description?: string;
  amount?: number;
  amountInWords?: string;
  paymentStatus?: "PENDING" | "PAID" | "DISPUTED";
  payBeforeDate?: string;
  evidenceImageUrl?: string;
  qrVerifyUrl?: string;
  cityAuthority?: string;
  stateAuthority?: string;
  contactNo?: string;
}

export default function OfficialGovernmentChallan({
  challanNumber = "GJ01TP5892615",
  challanDate = "20-06-2025",
  challanTime = "11:25 AM",
  registrationNo = "GJ01AB1234",
  vehicleType = "CAR",
  vehicleMake = "MARUTI SUZUKI",
  vehicleModel = "SWIFT DZIRE",
  vehicleColor = "WHITE",
  ownerName = "RAHUL SHARMA",
  parentName = "SURESH SHARMA",
  ownerAddress = "12, SHYAM NAGAR, AHMEDABAD, GUJARAT - 380015",
  mobileNo = "9876543210",
  location = "C.G. ROAD, AHMEDABAD, GUJARAT - 380009",
  violatingRule = "122/177 MVA",
  natureOfOffence = "ILLEGAL PARKING",
  description = "Vehicle parked in No Parking Zone causing obstruction.",
  amount = 1000,
  amountInWords = "Rupees One Thousand Only",
  paymentStatus = "PENDING",
  payBeforeDate = "05-07-2025",
  evidenceImageUrl = "/evidence/violations/violation_youtube_test_tr89_20260819_184818.jpg",
  qrVerifyUrl = "https://echallan.parivahan.gov.in",
  cityAuthority = "Ahmedabad City",
  stateAuthority = "Gujarat",
  contactNo = "079-27654321",
}: OfficialChallanProps) {
  const documentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const downloadPDF = async () => {
    if (!documentRef.current) return;
    try {
      setIsGenerating(true);
      const element = documentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, Math.min(pdfHeight, 297));
      pdf.save(`eChallan_${challanNumber}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-white/5 border border-white/10 no-print">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-neutral-200">
            Official E-Challan Citation Format (Ministry of Road Transport & Highways)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 border border-neutral-700 transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Challan
          </button>
          <button
            onClick={downloadPDF}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all shadow-md"
          >
            <Download className="h-3.5 w-3.5" />
            {isGenerating ? "Generating Official PDF..." : "Download Official PDF"}
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* 📄 OFFICIAL AUTHENTIC GOVERNMENT E-CHALLAN DOCUMENT (PURE WHITE A4)       */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <div className="flex justify-center overflow-x-auto py-2">
        <div
          ref={documentRef}
          className="w-[794px] min-h-[1123px] bg-white text-black p-8 font-sans border border-neutral-300 shadow-2xl relative select-text"
          style={{ fontFamily: "'Arial', 'Segoe UI', sans-serif" }}
        >
          {/* Top Outer Border Box */}
          <div className="border-[1.5px] border-black p-6 min-h-[1055px] flex flex-col justify-between">
            {/* 1. Header Section */}
            <div className="space-y-3 pb-4 border-b border-black">
              <div className="flex items-start justify-between">
                {/* Left: Challan No & Date */}
                <div className="w-1/3 space-y-1">
                  <div className="text-[11px] font-bold text-neutral-700 uppercase">
                    Challan No:
                  </div>
                  <div className="text-base font-black text-black tracking-tight font-mono">
                    {challanNumber}
                  </div>
                  <div className="pt-2 text-[11px] font-bold text-neutral-700">
                    Challan Date:
                  </div>
                  <div className="text-xs font-black text-black">
                    {challanDate} <span className="font-normal text-neutral-600">|</span> {challanTime}
                  </div>
                </div>

                {/* Center: National Emblem & Government Header */}
                <div className="w-1/3 flex flex-col items-center text-center">
                  {/* Ashoka Emblem SVG representation */}
                  <svg className="w-12 h-14 mb-1 text-black" viewBox="0 0 100 120" fill="currentColor">
                    <path d="M50 5 C40 5 35 15 35 25 C35 32 40 38 45 40 C35 42 25 50 25 65 C25 80 40 85 50 85 C60 85 75 80 75 65 C75 50 65 42 55 40 C60 38 65 32 65 25 C65 15 60 5 50 5 Z" fill="#222"/>
                    <circle cx="50" cy="95" r="12" fill="none" stroke="#222" strokeWidth="2"/>
                    <rect x="20" y="110" width="60" height="6" fill="#222"/>
                  </svg>
                  <div className="text-[10px] font-bold tracking-widest text-neutral-800 uppercase">
                    GOVERNMENT OF INDIA
                  </div>
                  <div className="text-lg font-black tracking-tight text-black uppercase leading-tight">
                    TRAFFIC POLICE
                  </div>
                  <div className="text-sm font-extrabold text-black uppercase tracking-wider">
                    E-CHALLAN
                  </div>
                  <div className="text-[9px] font-bold text-neutral-700 uppercase tracking-tight">
                    [UNDER MOTOR VEHICLES ACT, 1988]
                  </div>
                </div>

                {/* Right: Traffic Police Crest Badge */}
                <div className="w-1/3 flex justify-end">
                  <div className="w-16 h-18 border-2 border-blue-900 rounded-lg p-1 flex flex-col items-center justify-center bg-blue-950 text-white shadow-sm text-center">
                    <div className="w-5 h-5 rounded-full border border-yellow-400 bg-amber-500 mb-0.5 flex items-center justify-center text-[7px] font-bold">
                      ★
                    </div>
                    <span className="text-[7px] font-black uppercase tracking-tighter text-yellow-400">
                      TRAFFIC POLICE
                    </span>
                    <span className="text-[6px] font-bold text-neutral-300">
                      GUJARAT
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Vehicle Details & Owner Details (2-Column Box) */}
            <div className="grid grid-cols-2 gap-4 py-3 border-b border-black text-xs">
              {/* Left Column: Vehicle Details */}
              <div className="pr-3 border-r border-neutral-300 space-y-1.5">
                <div className="text-xs font-black uppercase tracking-wide text-black pb-1 border-b border-neutral-200">
                  VEHICLE DETAILS
                </div>
                <table className="w-full text-xs">
                  <tbody>
                    <tr>
                      <td className="w-28 py-0.5 font-bold text-neutral-800">Registration No.</td>
                      <td className="w-3 font-bold">:</td>
                      <td className="font-mono font-black text-black">{registrationNo}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-bold text-neutral-800">Vehicle Type</td>
                      <td className="font-bold">:</td>
                      <td className="font-extrabold text-black">{vehicleType}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-bold text-neutral-800">Vehicle Make</td>
                      <td className="font-bold">:</td>
                      <td className="font-extrabold text-black">{vehicleMake}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-bold text-neutral-800">Vehicle Model</td>
                      <td className="font-bold">:</td>
                      <td className="font-extrabold text-black">{vehicleModel}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-bold text-neutral-800">Vehicle Color</td>
                      <td className="font-bold">:</td>
                      <td className="font-extrabold text-black">{vehicleColor}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Right Column: Owner Details */}
              <div className="pl-1 space-y-1.5">
                <div className="text-xs font-black uppercase tracking-wide text-black pb-1 border-b border-neutral-200">
                  OWNER DETAILS
                </div>
                <table className="w-full text-xs">
                  <tbody>
                    <tr>
                      <td className="w-32 py-0.5 font-bold text-neutral-800">Owner Name</td>
                      <td className="w-3 font-bold">:</td>
                      <td className="font-extrabold text-black">{ownerName}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-bold text-neutral-800">Father / Husband Name</td>
                      <td className="font-bold">:</td>
                      <td className="font-extrabold text-black">{parentName}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-bold text-neutral-800 align-top">Address</td>
                      <td className="font-bold align-top">:</td>
                      <td className="font-bold text-neutral-900 leading-tight">{ownerAddress}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-bold text-neutral-800">Mobile No.</td>
                      <td className="font-bold">:</td>
                      <td className="font-mono font-bold text-black">{mobileNo}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Violation Details & Violation Image (2-Column Box) */}
            <div className="grid grid-cols-2 gap-4 py-3 border-b border-black text-xs">
              {/* Left Column: Violation Details */}
              <div className="pr-3 border-r border-neutral-300 space-y-2">
                <div className="text-xs font-black uppercase tracking-wide text-black pb-1 border-b border-neutral-200">
                  VIOLATION DETAILS
                </div>
                <table className="w-full text-xs">
                  <tbody>
                    <tr>
                      <td className="w-28 py-1 font-bold text-neutral-800 align-top">Location</td>
                      <td className="w-3 font-bold align-top">:</td>
                      <td className="font-bold text-black leading-tight">{location}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-bold text-neutral-800">Violation Date & Time</td>
                      <td className="font-bold">:</td>
                      <td className="font-bold text-black">{challanDate} | {challanTime}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-bold text-neutral-800">Violating Rule</td>
                      <td className="font-bold">:</td>
                      <td className="font-black text-black">{violatingRule}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-bold text-neutral-800">Nature of Offence</td>
                      <td className="font-bold">:</td>
                      <td className="font-black text-black uppercase">{natureOfOffence}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-bold text-neutral-800 align-top">Description</td>
                      <td className="font-bold align-top">:</td>
                      <td className="text-neutral-900 leading-tight">{description}</td>
                    </tr>
                    <tr>
                      <td className="pt-3 font-black text-sm text-black">Challan Amount</td>
                      <td className="pt-3 font-black text-sm">:</td>
                      <td className="pt-3 font-black text-base text-black">₹ {amount}/-</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Right Column: Violation Image */}
              <div className="pl-1 space-y-1.5 flex flex-col items-center">
                <div className="w-full text-xs font-black uppercase tracking-wide text-black pb-1 border-b border-neutral-200">
                  VIOLATION IMAGE
                </div>
                <div className="w-full h-44 border border-black p-1 bg-neutral-100 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={evidenceImageUrl}
                    alt="Violation Evidence"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* 4. Payment Details */}
            <div className="py-3 border-b border-black space-y-3">
              <div className="text-xs font-black uppercase tracking-wide text-black">
                PAYMENT DETAILS
              </div>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-neutral-800">Amount in Words: </span>
                  <span className="font-bold text-black">{amountInWords}</span>
                </div>
                <div>
                  <span className="font-bold text-neutral-800">Payment Status: </span>
                  <span className={`font-black uppercase ${paymentStatus === "PAID" ? "text-emerald-700" : "text-red-600"}`}>
                    : {paymentStatus}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                {/* QR Code Pay Box */}
                <div className="border border-black p-2.5 flex items-center gap-3">
                  {/* QR Code SVG */}
                  <div className="w-16 h-16 border border-black p-1 bg-white shrink-0 grid grid-cols-5 grid-rows-5 gap-0.5">
                    <div className="bg-black col-span-2 row-span-2" />
                    <div className="bg-black" />
                    <div className="bg-black col-span-2 row-span-2" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-black col-span-2 row-span-2" />
                    <div className="bg-black" />
                    <div className="bg-black col-span-2 row-span-2" />
                  </div>
                  <div className="text-[10px] space-y-0.5 leading-tight">
                    <div className="font-bold text-black">Scan QR Code to Pay</div>
                    <div className="text-[9px] text-neutral-700">Or visit: https://echallan.parivahan.gov.in</div>
                    <div className="font-mono text-[9px] font-bold">Challan No: {challanNumber}</div>
                    <div className="font-mono text-[9px] font-bold">Vehicle No: {registrationNo}</div>
                  </div>
                </div>

                {/* Pay Before Date Box */}
                <div className="border border-black p-2.5 flex flex-col items-center justify-center text-center">
                  <div className="text-xs font-bold text-neutral-800">Pay Before</div>
                  <div className="text-xl font-black text-red-600 tracking-tight font-mono">
                    {payBeforeDate}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Note & Barcode */}
            <div className="grid grid-cols-2 gap-4 py-3 border-b border-black text-[10px]">
              <div className="space-y-0.5 text-neutral-800">
                <div className="font-bold text-black text-xs">Note:</div>
                <div>1. This is a computer generated challan and does not require any signature.</div>
                <div>2. Please pay the challan amount online before the due date.</div>
                <div>3. Late payment may attract additional penalty.</div>
              </div>

              {/* Barcode representation */}
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-[2px] h-9">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-black h-full"
                      style={{ width: i % 3 === 0 ? "3px" : i % 2 === 0 ? "1.5px" : "1px" }}
                    />
                  ))}
                </div>
                <div className="text-xs font-mono font-bold tracking-widest text-black mt-1">
                  {challanNumber}
                </div>
              </div>
            </div>

            {/* 6. Footer (Authority, Seal Stamp, Queries) */}
            <div className="grid grid-cols-3 gap-2 pt-3 text-[10px] items-center">
              {/* Left: Generated By */}
              <div className="space-y-0.5 leading-tight">
                <div className="font-bold text-black text-[11px]">Challan Generated By</div>
                <div className="font-bold text-neutral-800">Traffic Police Department</div>
                <div className="text-neutral-800">{cityAuthority}</div>
                <div className="text-neutral-800">{stateAuthority}</div>
                <div className="text-neutral-800">Contact No.: {contactNo}</div>
              </div>

              {/* Center: Circular Traffic Police Stamp Seal */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full border-[2.5px] border-blue-900 p-1 flex flex-col items-center justify-center text-center text-blue-900 shadow-inner">
                  <div className="text-[6px] font-black tracking-widest uppercase">TRAFFIC POLICE</div>
                  <div className="w-5 h-5 my-0.5 rounded-full border border-blue-900 flex items-center justify-center text-[7px] font-bold">
                    ⚖
                  </div>
                  <div className="text-[6px] font-black uppercase tracking-tight">{cityAuthority}</div>
                </div>
              </div>

              {/* Right: Helpline & Query */}
              <div className="space-y-0.5 leading-tight text-right">
                <div className="font-bold text-black text-[11px]">For any queries</div>
                <div className="text-neutral-800">Visit: https://echallan.parivahan.gov.in</div>
                <div className="text-neutral-800">Email: support-echallan@gov.in</div>
                <div className="font-bold text-black">Helpline: 1800-123-5678</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
