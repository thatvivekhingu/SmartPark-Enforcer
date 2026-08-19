import React, { useState, useEffect, useRef } from 'react'
import { Video, Shield, Maximize2 } from 'lucide-react'

// Animated dwell progress ring
function DwellRing({ seconds = 0, max = 120 }) {
  const r = 16
  const circ = 2 * Math.PI * r
  const pct = Math.min(seconds / max, 1)
  const dash = pct * circ
  const isViolation = pct >= 1

  return (
    <svg width="40" height="40" className="shrink-0">
      {/* Track */}
      <circle cx="20" cy="20" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
      {/* Progress */}
      <circle
        cx="20" cy="20" r={r}
        fill="none"
        stroke={isViolation ? '#EF4444' : '#3B82F6'}
        strokeWidth="2.5"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset="0"
        strokeLinecap="round"
        transform="rotate(-90 20 20)"
        style={{ transition: 'stroke-dasharray 0.3s ease, stroke 0.3s ease' }}
      />
      <text
        x="20" y="20"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="8"
        fontFamily="JetBrains Mono, monospace"
        fontWeight="600"
        fill={isViolation ? '#F87171' : '#94A3B8'}
      >
        {seconds}s
      </text>
    </svg>
  )
}

// Corner bracket bounding box
function BoundingBox({ children, isViolation }) {
  const c = isViolation ? '#EF4444' : '#3B82F6'
  const bg = isViolation ? 'rgba(239,68,68,0.05)' : 'rgba(59,130,246,0.05)'
  return (
    <div className="relative" style={{ display: 'inline-block' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: bg,
        border: `1px solid ${c}22`,
        borderRadius: '4px',
        pointerEvents: 'none',
      }} />
      {/* Corners */}
      {[
        { top: -1, left: -1, borderRight: 'none', borderBottom: 'none' },
        { top: -1, right: -1, borderLeft: 'none', borderBottom: 'none' },
        { bottom: -1, left: -1, borderRight: 'none', borderTop: 'none' },
        { bottom: -1, right: -1, borderLeft: 'none', borderTop: 'none' },
      ].map((style, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 14, height: 14,
          border: `2px solid ${c}`,
          ...style,
          pointerEvents: 'none',
        }} />
      ))}
      {children}
    </div>
  )
}

export default function LiveFeed() {
  const [streamError, setStreamError] = useState(false)
  const [dwellSec, setDwellSec] = useState(0)

  // Simulate incrementing dwell timer for demo mode
  useEffect(() => {
    if (!streamError) return
    const id = setInterval(() => setDwellSec(s => s < 125 ? s + 1 : 125), 1000)
    return () => clearInterval(id)
  }, [streamError])

  const isViolation = dwellSec >= 120

  return (
    <div className="card animate-fadeUp flex flex-col" style={{ animationDelay: '0ms' }}>
      <div className="card-header">
        <div className="card-title">
          <Video className="w-4 h-4 text-primary-400" strokeWidth={1.8} />
          Live CCTV Stream
        </div>
        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60A5FA' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulseSlow inline-block" />
            Shapely Polygon Active
          </span>
          <button
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Video area */}
      <div className="relative" style={{ aspectRatio: '16/9', background: '#070B12', overflow: 'hidden' }}>
        {!streamError ? (
          <img
            src="/api/stream"
            alt="Live Enforcement Feed"
            className="w-full h-full object-cover"
            onError={() => setStreamError(true)}
          />
        ) : (
          /* Enterprise demo canvas — visible on Vercel cloud */
          <div className="absolute inset-0 flex items-center justify-center" style={{
            background: 'radial-gradient(ellipse at 50% 60%, #0D1A2D 0%, #070B12 70%)',
          }}>
            {/* Simulated road grid */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* No-Parking Geo-Fence Polygon */}
            <div className="absolute" style={{
              top: '12%', left: '22%', right: '8%', bottom: '8%',
              border: '1.5px solid rgba(239,68,68,0.5)',
              borderRadius: '6px',
              background: 'rgba(239,68,68,0.04)',
              boxShadow: isViolation
                ? '0 0 24px rgba(239,68,68,0.15), inset 0 0 24px rgba(239,68,68,0.06)'
                : '0 0 16px rgba(239,68,68,0.08)',
            }}>
              {/* Zone label */}
              <div className="absolute top-2 left-3 flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-danger-500/70" strokeWidth={1.8} />
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(239,68,68,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
                  No-Parking Zone
                </span>
              </div>

              {/* Simulated vehicle + bounding box */}
              <div className="absolute" style={{ top: '35%', left: '28%' }}>
                <BoundingBox isViolation={isViolation}>
                  <div style={{
                    width: 200, height: 90,
                    background: isViolation ? 'rgba(239,68,68,0.08)' : 'rgba(59,130,246,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{
                      width: 120, height: 60,
                      background: '#1E3A5F',
                      borderRadius: '6px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', color: '#94A3B8',
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      🚗 Vehicle
                    </div>
                  </div>
                </BoundingBox>

                {/* Detection chip — attached above bounding box */}
                <div style={{
                  position: 'absolute',
                  top: -28,
                  left: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: isViolation ? 'rgba(30,10,10,0.9)' : 'rgba(10,20,35,0.9)',
                  border: `1px solid ${isViolation ? 'rgba(239,68,68,0.4)' : 'rgba(59,130,246,0.35)'}`,
                  borderRadius: '5px',
                  padding: '4px 8px',
                  backdropFilter: 'blur(8px)',
                  whiteSpace: 'nowrap',
                }}>
                  <span style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }}>#1 · CAR</span>
                  <span style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.1)' }} />
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#FCD34D', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em' }}>MH12AB1234</span>
                  <span style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.1)' }} />
                  <DwellRing seconds={dwellSec} max={120} />
                </div>
              </div>
            </div>

            {/* Corner grid overlay decorations */}
            {isViolation && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded" style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
              }}>
                <span className="w-1.5 h-1.5 rounded-full bg-danger-500 animate-pulseSlow inline-block" />
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#F87171', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Violation Confirmed
                </span>
              </div>
            )}

            <div className="absolute bottom-3 right-3" style={{
              background: 'rgba(10,20,35,0.85)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '6px',
              padding: '5px 10px',
              backdropFilter: 'blur(8px)',
            }}>
              <span style={{ fontSize: '10px', color: '#64748B', fontFamily: 'JetBrains Mono, monospace' }}>
                CAM-01 · Zone [300,200]→[980,580] · 120s Rule
              </span>
            </div>
          </div>
        )}

        {/* LIVE badge — always shown */}
        <div className="absolute top-3 left-3" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(10,20,35,0.8)',
          border: '1px solid rgba(59,130,246,0.3)',
          borderRadius: '5px',
          padding: '4px 10px',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 0 12px rgba(59,130,246,0.15)',
        }}>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulseSlow" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#60A5FA', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Live Enforcement
          </span>
        </div>
      </div>
    </div>
  )
}
