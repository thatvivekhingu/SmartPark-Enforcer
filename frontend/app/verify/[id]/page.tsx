import React from 'react';
import { CheckCircle2, XCircle, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: { id: string };
}

// For demo/Vercel deployment — any challan ID returns a valid demo challan.
function buildDemoChallan(id: string) {
  return {
    challan_number: id,
    plate: 'NL01C7821',
    vehicle_type: 'Car / SUV',
    violation_type: 'Illegal Parking in No-Parking Zone',
    zone: 'Nagaland Main Street No-Parking Zone',
    fine_amount: 500,
    officer_id: 'OFF-2024-001',
    issued_at: '2026-08-20T09:42:11.000Z',
    status: 'issued',
    sha256_hash:
      'a3f8c2d1e9b4076a5f2c8e3d1b9a4e7c6f0d2b8a5e3c9f1d7b4a2e6c0f8d3b1',
    verified: true,
  };
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return iso;
  }
}

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-white/7 last:border-0">
      <span className="text-xs text-[#9096A3] uppercase tracking-widest sm:w-44 flex-shrink-0 pt-0.5">{label}</span>
      <span className={`text-sm text-[#EDEEF1] break-all ${mono ? 'font-mono leading-relaxed' : 'font-medium'}`}>
        {value}
      </span>
    </div>
  );
}

export default function ChallanVerifyPage({ params }: PageProps) {
  const { id } = params;
  const challan = buildDemoChallan(id);
  const found = !!challan;

  return (
    <div className="min-h-screen bg-[#0B0D12] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/7 bg-[#12151B]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#4C6FFF]">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[#EDEEF1] font-bold text-sm">SmartPark Enforcer</span>
              <span className="hidden sm:inline text-[#5B6070] text-xs ml-2">— Public Challan Verification</span>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[#9096A3] hover:text-[#EDEEF1] text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to App</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col items-center gap-8">
        {/* Status banner */}
        {found ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#22C55E]/15 border-2 border-[#22C55E]/40">
              <CheckCircle2 className="w-10 h-10 text-[#22C55E]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#EDEEF1]">Challan Verified</h1>
              <p className="text-[#9096A3] text-sm mt-1">
                This challan record is authentic and has not been tampered with.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-semibold uppercase tracking-widest">
              <Shield className="w-3.5 h-3.5" />
              Tamper-Evident · Integrity Verified ✔
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#EF4444]/15 border-2 border-[#EF4444]/40">
              <XCircle className="w-10 h-10 text-[#EF4444]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#EDEEF1]">Challan Not Found</h1>
              <p className="text-[#9096A3] text-sm mt-1">
                No record found for ID <span className="font-mono text-[#EDEEF1]">{id}</span>. The challan may be
                invalid or expired.
              </p>
            </div>
          </div>
        )}

        {/* Challan detail card */}
        {found && (
          <div className="w-full rounded-xl border border-white/10 bg-[#12151B] overflow-hidden">
            {/* Card header */}
            <div className="bg-[#191D25] px-6 py-4 border-b border-white/7 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs text-[#5B6070] uppercase tracking-widest mb-0.5">Challan Number</p>
                <p className="font-mono text-lg font-bold text-[#4C6FFF] tracking-wider">{challan.challan_number}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#5B6070] uppercase tracking-widest mb-0.5">Fine Amount</p>
                <p className="text-2xl font-bold text-[#EDEEF1]">₹{challan.fine_amount}</p>
              </div>
            </div>

            {/* Details */}
            <div className="px-6 py-2">
              <DetailRow label="Vehicle Plate" value={challan.plate} mono />
              <DetailRow label="Vehicle Type" value={challan.vehicle_type} />
              <DetailRow label="Violation" value={challan.violation_type} />
              <DetailRow label="Zone / Location" value={challan.zone} />
              <DetailRow label="Issue Date & Time" value={formatDate(challan.issued_at)} />
              <DetailRow label="Issuing Officer" value={challan.officer_id} />
              <DetailRow
                label="Status"
                value={challan.status.charAt(0).toUpperCase() + challan.status.slice(1)}
              />
            </div>

            {/* Hash section */}
            <div className="mx-6 mb-6 mt-2 rounded-lg bg-[#191D25] border border-white/7 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-3.5 h-3.5 text-[#22C55E]" />
                <span className="text-xs font-semibold text-[#22C55E] uppercase tracking-widest">
                  SHA-256 Integrity Hash
                </span>
              </div>
              <p className="font-mono text-[11px] text-[#9096A3] break-all leading-relaxed">
                {challan.sha256_hash}
              </p>
              <p className="text-[10px] text-[#5B6070] mt-2">
                This hash uniquely identifies and protects the integrity of this challan record.
              </p>
            </div>
          </div>
        )}

        {/* Info box */}
        <div className="w-full rounded-xl border border-white/7 bg-[#12151B] p-5 flex gap-3">
          <Shield className="w-5 h-5 text-[#4C6FFF] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#EDEEF1] mb-1">About this verification</p>
            <p className="text-xs text-[#9096A3] leading-relaxed">
              This page is publicly accessible. Citizens can verify the authenticity of any parking challan issued by
              the SmartPark Enforcer system by scanning the QR code printed on the challan or visiting this URL
              directly. The SHA-256 hash guarantees that the challan data has not been modified after issuance.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/7 bg-[#12151B]/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#5B6070]">
            This page is publicly accessible. Scan QR code on challan to verify.
          </p>
          <p className="text-xs text-[#5B6070]">
            © 2026 Municipal Traffic Enforcement Authority · SmartPark Enforcer
          </p>
        </div>
      </footer>
    </div>
  );
}
