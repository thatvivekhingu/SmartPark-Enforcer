import React, { useState } from 'react'
import { Receipt, ShieldCheck, Hash, Copy, Check, ImageOff, ExternalLink } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || ''

function Row({ label, value, mono = false, color = '#D4D4D8' }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)',
    }}>
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#52525B' }}>
        {label}
      </span>
      <span style={{
        fontFamily: mono ? "'JetBrains Mono', monospace" : 'Inter, sans-serif',
        fontSize: mono ? 11 : 12,
        fontWeight: mono ? 600 : 500,
        letterSpacing: mono ? '0.04em' : 0,
        color,
      }}>{value || '--'}</span>
    </div>
  )
}

function HashBlock({ hash }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  if (!hash) return <div className="skeleton" style={{ height: 32, borderRadius: 5 }} />

  const short = `${hash.slice(0, 12)}...${hash.slice(-12)}`
  const copy = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(hash).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        padding: '8px 10px', borderRadius: 5, cursor: 'pointer',
        background: '#07070A',
        border: '1px solid rgba(245,158,11,0.1)',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.25)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.1)'}
    >
      <span className="font-mono" style={{ fontSize: 10, color: '#D97706', lineHeight: 1.5, wordBreak: 'break-all', flex: 1 }}>
        {expanded ? hash : short}
      </span>
      <button onClick={copy} style={{
        flexShrink: 0, padding: 3, borderRadius: 3,
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {copied ? <Check size={10} color="#34D399" strokeWidth={2.5} /> : <Copy size={10} color="#52525B" strokeWidth={1.8} />}
      </button>
    </div>
  )
}

export default function DigitalChallanCard({ challan }) {
  const d = challan || {}

  if (!d.challan_id && !d.violation_id) {
    return (
      <div className="card animate-fadeUp" style={{ animationDelay: '80ms' }}>
        <div className="card-header">
          <div className="card-title">
            <Receipt size={13} color="#F59E0B" strokeWidth={2.2} />
            Digital Challan
          </div>
        </div>
        <div style={{ padding: '32px 18px', textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(245,158,11,0.04)',
            border: '1px solid rgba(245,158,11,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 10px',
          }}>
            <Receipt size={18} color="#3F3F46" strokeWidth={1.5} />
          </div>
          <div style={{ fontSize: 12, color: '#52525B', fontWeight: 500 }}>No challan issued yet</div>
          <div style={{ fontSize: 10, color: '#27272A', marginTop: 4 }}>Appears after a violation is confirmed</div>
        </div>
      </div>
    )
  }

  const hasEv = !!d.evidence_image

  return (
    <div className="card animate-fadeUp" style={{ animationDelay: '80ms' }}>
      <div className="card-header">
        <div className="card-title">
          <Receipt size={13} color="#F59E0B" strokeWidth={2.2} />
          Digital Challan
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '3px 8px', borderRadius: 99,
          background: 'rgba(16,185,129,0.06)',
          border: '1px solid rgba(16,185,129,0.15)',
        }}>
          <ShieldCheck size={10} color="#34D399" strokeWidth={2.5}
            style={{ filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.5))' }} />
          <span style={{ fontSize: 9, fontWeight: 700, color: '#34D399', letterSpacing: '0.06em' }}>
            TAMPER-PROOF
          </span>
        </div>
      </div>

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Evidence Image */}
        <div>
          {hasEv ? (
            <img
              src={`${API_BASE}/${d.evidence_image}`}
              alt="Violation evidence"
              style={{
                width: '100%', borderRadius: 6, objectFit: 'cover',
                display: 'block', border: '1px solid rgba(255,255,255,0.05)',
                maxHeight: 160,
              }}
              onError={(e) => { e.target.style.display = 'none' }}
            />
          ) : null}
          {!hasEv && (
            <div style={{
              width: '100%', height: 100, borderRadius: 6,
              background: '#07070A', border: '1px solid rgba(255,255,255,0.04)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <ImageOff size={16} color="#27272A" strokeWidth={1.5} />
              <span style={{ fontSize: 10, color: '#27272A' }}>Awaiting evidence</span>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div>
          <Row label="Challan ID" value={d.challan_id} mono color="#71717A" />
          <Row label="Violation" value={d.violation_id} mono color="#F59E0B" />
          <Row label="Vehicle" value={d.vehicle_number} mono color="#FBBF24" />
          <Row label="Type" value={d.vehicle_type} color="#A1A1AA" />
          <Row label="Fine" value={d.fine_amount ? `\u20B9${d.fine_amount}` : '--'} color="#34D399" />
          <Row label="Issued" value={d.issued_at} mono color="#52525B" />
        </div>

        {/* SHA-256 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
            <Hash size={10} color="#52525B" strokeWidth={2} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3F3F46' }}>
              SHA-256 Evidence Hash
            </span>
          </div>
          <HashBlock hash={d.sha256_hash} />
        </div>
      </div>
    </div>
  )
}
