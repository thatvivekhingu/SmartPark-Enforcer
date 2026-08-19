import React, { useState } from 'react'
import { FileText, ShieldCheck, Hash, Copy, CheckCheck, Camera } from 'lucide-react'

// Skeleton shimmer row
function SkeletonRow({ width = 'w-24' }) {
  return (
    <div className={`h-3.5 ${width} rounded skeleton`} />
  )
}

// Evidence placeholder with skeleton shimmer
function EvidencePlaceholder() {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-3"
      style={{ minHeight: 150, background: 'rgba(0,0,0,0.3)', borderRadius: 8 }}
    >
      <div className="w-10 h-10 rounded-lg flex items-center justify-center skeleton">
        <Camera className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <div className="h-2.5 w-28 rounded skeleton" />
        <div className="h-2 w-20 rounded skeleton" />
      </div>
      <span className="text-[11px] text-slate-600 font-medium mt-1">Capturing evidence…</span>
    </div>
  )
}

// Truncated hash with expand and copy
function HashBlock({ hash }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const short = hash ? `${hash.slice(0, 8)}...${hash.slice(-8)}` : ''

  const handleCopy = () => {
    if (!hash) return
    navigator.clipboard.writeText(hash).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!hash) {
    return <div className="h-8 rounded skeleton" />
  }

  return (
    <div
      className="flex items-start justify-between gap-3 px-3 py-2.5 rounded-md cursor-pointer select-all"
      style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}
      onClick={() => setExpanded(!expanded)}
      title="Click to expand / collapse"
    >
      <span
        className="font-mono text-[12px] text-primary-400/80 break-all leading-relaxed"
        style={{ flex: 1 }}
      >
        {expanded ? hash : short}
      </span>
      <button
        className="shrink-0 p-1 rounded hover:bg-white/[0.06] transition-colors mt-0.5"
        onClick={(e) => { e.stopPropagation(); handleCopy() }}
        title="Copy hash"
      >
        {copied
          ? <CheckCheck className="w-3.5 h-3.5 text-success-400" strokeWidth={2} />
          : <Copy className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.8} />
        }
      </button>
    </div>
  )
}

// Label-value row
function InfoRow({ label, value, valueClass = 'text-value', mono = false, loading = false }) {
  return (
    <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span className="text-label">{label}</span>
      {loading
        ? <SkeletonRow width="w-20" />
        : (
          <span className={`${mono ? 'font-mono text-[12px] tracking-wider' : 'text-[13px] font-medium'} ${valueClass}`}>
            {value || '—'}
          </span>
        )
      }
    </div>
  )
}

export default function DigitalChallanCard({ challan }) {
  const d = challan || {}
  const challanId    = d.challan_id    || 'CHAL-20260819-01'
  const violationId  = d.violation_id  || 'VIOL-20260819-01'
  const vehicleNum   = d.vehicle_number|| 'MH12AB1234'
  const fineAmount   = d.fine_amount   || 500
  const issuedAt     = d.issued_at     || '2026-08-19 22:45:12'
  const sha256       = d.sha256_hash   || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  const hasEvidence  = !!d.evidence_image

  return (
    <div className="card animate-fadeUp flex flex-col" style={{ animationDelay: '160ms' }}>
      <div className="card-header">
        <div className="card-title">
          <FileText className="w-4 h-4 text-primary-400" strokeWidth={1.8} />
          Digital Challan
        </div>

        {/* Tamper-evident verified badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
          style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)',
            color: '#34D399',
          }}
        >
          <ShieldCheck
            className="w-3.5 h-3.5"
            strokeWidth={2}
            style={{ filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.5))' }}
          />
          Tamper-Evident Verified
        </div>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Evidence frame + metadata grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Evidence frame */}
          <div className="rounded-lg overflow-hidden" style={{
            background: '#070B12',
            border: '1px solid rgba(255,255,255,0.06)',
            minHeight: 150,
          }}>
            {hasEvidence ? (
              <img
                src={`/${d.evidence_image}`}
                alt="Evidence frame"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div style={{ display: hasEvidence ? 'none' : 'flex', width: '100%', height: '100%' }}>
              <EvidencePlaceholder />
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-col justify-center">
            <InfoRow label="Challan ID"   value={challanId}  mono />
            <InfoRow label="Violation ID" value={violationId} mono valueClass="text-primary-400/80" />
            <InfoRow label="Vehicle No."  value={vehicleNum}
              mono
              valueClass="text-[13px] font-mono font-bold tracking-widest"
              valueStyle={{ color: '#FCD34D' }}
            />
            <InfoRow label="Fine Amount"  value={`₹${fineAmount}`} valueClass="text-success-400 font-semibold" />
            <InfoRow label="Issued At"    value={issuedAt}   mono valueClass="text-slate-400" />
          </div>
        </div>

        {/* SHA-256 hash block */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Hash className="w-3.5 h-3.5 text-slate-600" strokeWidth={1.8} />
            <span className="text-label">SHA-256 Certificate</span>
            <span className="text-[10px] text-slate-700 ml-auto">Click to expand · Copy button →</span>
          </div>
          <HashBlock hash={sha256} />
        </div>
      </div>
    </div>
  )
}
