import React from 'react'
import { FileText, CheckCircle2, Hash } from 'lucide-react'

export default function DigitalChallanCard({ challan }) {
  const challanData = challan || {}
  const challanId = challanData.challan_id || "CHAL-20260819-01"
  const violationId = challanData.violation_id || "VIOL-20260819-01"
  const vehicleNumber = challanData.vehicle_number || "MH12AB1234"
  const fineAmount = challanData.fine_amount || 500
  const issuedAt = challanData.issued_at || "2026-08-19 22:45:12"
  const sha256Hash = challanData.sha256_hash || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">LATEST DIGITAL CHALLAN</h2>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>TAMPER-EVIDENT VERIFIED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Evidence Image */}
        <div className="relative bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center min-h-[160px]">
          {challanData.evidence_image ? (
            <img
              src={`/${challanData.evidence_image}`}
              alt="Evidence Frame"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 400 225'><rect width='400' height='225' fill='%23020617'/><text x='50%' y='45%' font-family='sans-serif' font-size='14' fill='%23ef4444' text-anchor='middle'>EVIDENCE CAPTURED</text><text x='50%' y='60%' font-family='sans-serif' font-size='12' fill='%23e2e8f0' text-anchor='middle'>MH12AB1234 &bull; 125s Dwell</text></svg>";
              }}
            />
          ) : (
            <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-3 text-center">
              <span className="text-xs text-red-400 font-mono font-bold">EVIDENCE FRAME CAPTURED</span>
              <span className="text-[11px] text-yellow-300 font-mono mt-1 font-bold">MH12AB1234</span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">125s Dwell &bull; CAM-01</span>
            </div>
          )}
        </div>

        {/* Challan Metadata Details */}
        <div className="flex flex-col justify-between gap-2 text-xs font-mono">
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">CHALLAN ID:</span>
              <span className="text-slate-100 font-bold">{challanId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">VIOLATION ID:</span>
              <span className="text-cyan-400">{violationId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">VEHICLE NUMBER:</span>
              <span className="text-yellow-400 font-bold text-sm">{vehicleNumber}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">FINE AMOUNT:</span>
              <span className="text-emerald-400 font-bold">₹{fineAmount}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">ISSUED AT:</span>
              <span className="text-slate-300">{issuedAt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SHA-256 Hash Card Footer */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col gap-1 text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Hash className="w-3.5 h-3.5 text-cyan-400" />
          <span>DETERMINISTIC SHA-256 HASH CERTIFICATE:</span>
        </div>
        <div className="text-cyan-300 break-all bg-slate-900/80 p-2 rounded border border-slate-800/80 select-all font-semibold">
          {sha256Hash}
        </div>
      </div>
    </div>
  )
}
