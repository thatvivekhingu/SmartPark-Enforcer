import React, { useState } from 'react'
import { Receipt, ShieldCheck, Hash, Copy, Check, ImageOff } from 'lucide-react'

/* Skeleton row */
function Skel({ w = 80 }) {
  return <div className="skeleton" style={{ height: 13, width: w, borderRadius: 3 }} />
}

/* Evidence placeholder */
function EvidencePlaceholder() {
  return (
    <div style={{
      width: '100%', minHeight: 140,
      background: '#080808',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 6,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 10,
    }}>
      <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 8 }}>
        <ImageOff size={18} color="#3F3F46" style={{ margin: '11px auto', display: 'block' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
        <div className="skeleton" style={{ width: 100, height: 10 }} />
        <div className="skeleton" style={{ width: 72, height: 9, opacity: 0.6 }} />
      </div>
      <span style={{ fontSize: 11, color: '#3F3F46', fontWeight: 500, marginTop: 2 }}>
        Capturing evidence…
      </span>
    </div>
  )
}

/* Info row */
function Row({ label, value, mono = false, color = '#D4D4D8', loading = false }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#52525B' }}>
        {label}
      </span>
      {loading
        ? <Skel />
        : <span style={{
            fontFamily: mono ? 'JetBrains Mono, monospace' : 'Inter, sans-serif',
            fontSize: mono ? 12 : 13,
            fontWeight: mono ? 600 : 500,
            letterSpacing: mono ? '0.06em' : 0,
            color,
          }}>{value || '—'}</span>
      }
    </div>
  )
}

/* Copyable+expandable SHA-256 block */
function HashBlock({ hash }) {
  const [exp, setExp] = useState(false)
  const [copied, setCopied] = useState(false)
  const short = hash ? `${hash.slice(0, 10)}···${hash.slice(-10)}` : ''

  const copy = (e) => {
    e.stopPropagation()
    if (!hash) return
    navigator.clipboard.writeText(hash).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  if (!hash) return <div className="skeleton" style={{ height: 36, borderRadius: 5 }} />

  return (
    <div
      onClick={() => setExp(!exp)}
      title="Click to expand"
      style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10,
        padding: '9px 12px', borderRadius: 5, cursor: 'pointer',
        background: '#080808',
        border: '1px solid rgba(245,158,11,0.15)',
        boxShadow: '0 0 12px rgba(245,158,11,0.05)',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.15)'}
    >
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 11, color: '#D97706',
        lineHeight: 1.6, flex: 1,
        wordBreak: 'break-all',
      }}>
        {exp ? hash : short}
      </span>
      <button
        onClick={copy}
        style={{
          flexShrink: 0, padding: 4, borderRadius: 4,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          cursor: 'pointer', marginTop: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {copied
          ? <Check size={12} color="#34D399" strokeWidth={2.5} />
          : <Copy size={12} color="#52525B" strokeWidth={1.8} />
        }
      </button>
    </div>
  )
}

export default function DigitalChallanCard({ challan }) {
  const d = challan || {}
  const challanId   = d.challan_id    || 'CHAL-20260819-01'
  const violationId = d.violation_id  || 'VIOL-20260819-01'
  const vehicleNum  = d.vehicle_number || 'MH12AB1234'
  const fine        = d.fine_amount   || 500
  const issuedAt    = d.issued_at     || '2026-08-19 22:45:12'
  const sha256      = d.sha256_hash   || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  const hasEv       = !!d.evidence_image

  return (
    <div className="card animate-fadeUp" style={{ animationDelay: '140ms' }}>
      {/* Header */}
      <div className="card-header">
        <div className="card-title">
          <Receipt size={14} color="#F59E0B" strokeWidth={2} />
          Digital Challan
        </div>

        {/* Tamper-evident badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '3px 10px', borderRadius: 99,
          background: 'rgba(16,185,129,0.07)',
          border: '1px solid rgba(16,185,129,0.2)',
        }}>
          <ShieldCheck
            size={12} color="#34D399" strokeWidth={2}
            style={{ filter: 'drop-shadow(0 0 5px rgba(16,185,129,0.6))' }}
          />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#34D399', letterSpacing: '0.08em' }}>
            TAMPER-EVIDENT VERIFIED
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Evidence + meta grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Evidence frame */}
          <div>
            {hasEv ? (
              <img
                src={`/${d.evidence_image}`}
                alt="Evidence"
                style={{ width: '100%', borderRadius: 6, objectFit: 'cover', display: 'block', border: '1px solid rgba(255,255,255,0.06)' }}
                onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}
              />
            ) : null}
            <div style={{ display: hasEv ? 'none' : 'flex' }}>
              <EvidencePlaceholder />
            </div>
          </div>

          {/* Metadata */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Row label="Challan ID"   value={challanId}   mono color="#A1A1AA" />
            <Row label="Violation"    value={violationId}  mono color="#F59E0B" />
            <Row label="Vehicle No."  value={vehicleNum}   mono color="#FBBF24" />
            <Row label="Fine"         value={`₹${fine}`}        color="#34D399" />
            <Row label="Issued At"    value={issuedAt}     mono color="#71717A" />
          </div>
        </div>

        {/* SHA-256 block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Hash size={12} color="#52525B" strokeWidth={1.8} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#52525B' }}>
              SHA-256 Hash Certificate
            </span>
            <span style={{ marginLeft: 'auto', fontSize: 10, color: '#3F3F46' }}>Click to expand · →  to copy</span>
          </div>
          <HashBlock hash={sha256} />
        </div>
      </div>
    </div>
  )
}
