import React, { useState, useEffect } from 'react'
import { MonitorPlay, Maximize2, MapPin } from 'lucide-react'

/* ── SVG Dwell progress ring ───────────────────── */
function DwellRing({ sec = 0, max = 120 }) {
  const r = 20
  const circ = 2 * Math.PI * r
  const pct = Math.min(sec / max, 1)
  const isViol = pct >= 1
  const color = isViol ? '#FF4444' : '#F59E0B'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <svg width={50} height={50}>
        <circle cx={25} cy={25} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
        <circle
          cx={25} cy={25} r={r}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeDasharray={`${pct * circ} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 25 25)"
          style={{ transition: 'stroke-dasharray 1s ease, stroke 0.5s ease', filter: `drop-shadow(0 0 4px ${color}80)` }}
        />
        <text x={25} y={25} textAnchor="middle" dominantBaseline="central"
          fontSize={10} fontFamily="JetBrains Mono, monospace" fontWeight={700}
          fill={color}
        >{sec}s</text>
      </svg>
      <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', color: isViol ? '#FF6B6B' : '#71717A' }}>
        {isViol ? 'VIOLATION' : `/ ${max}s`}
      </span>
    </div>
  )
}

/* ── Corner bracket bounding box ───────────────── */
function BBox({ children, isViol = false }) {
  const c = isViol ? '#FF4444' : '#F59E0B'
  const corners = [
    { top: -2, left: -2, borderRight: 'none', borderBottom: 'none' },
    { top: -2, right: -2, borderLeft: 'none', borderBottom: 'none' },
    { bottom: -2, left: -2, borderRight: 'none', borderTop: 'none' },
    { bottom: -2, right: -2, borderLeft: 'none', borderTop: 'none' },
  ]
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {corners.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', width: 14, height: 14,
          border: `2px solid ${c}`, ...s, borderRadius: 2,
          pointerEvents: 'none',
          filter: `drop-shadow(0 0 3px ${c})`,
        }} />
      ))}
      <div style={{
        position: 'absolute', inset: 0,
        background: isViol ? 'rgba(255,68,68,0.04)' : 'rgba(245,158,11,0.04)',
        pointerEvents: 'none',
      }} />
      {children}
    </div>
  )
}

export default function LiveFeed() {
  const [streamErr, setStreamErr] = useState(false)
  const [dwell, setDwell] = useState(0)

  useEffect(() => {
    if (!streamErr) return
    const id = setInterval(() => setDwell(s => s < 125 ? s + 1 : 125), 1000)
    return () => clearInterval(id)
  }, [streamErr])

  const isViol = dwell >= 120

  return (
    <div className="card animate-fadeUp" style={{ animationDelay: '0ms' }}>
      {/* Card Header */}
      <div className="card-header">
        <div className="card-title">
          <MonitorPlay size={14} color="#F59E0B" strokeWidth={2} />
          Live CCTV Stream
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 99,
            background: 'rgba(34,211,238,0.07)',
            border: '1px solid rgba(34,211,238,0.18)',
            fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#22D3EE',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22D3EE', display: 'inline-block', animation: 'blink 1.2s ease-in-out infinite' }} />
            GEO-FENCE ON
          </span>
          <button style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#52525B',
          }}>
            <Maximize2 size={13} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* ── Video Container ─────────────────────────── */}
      <div style={{ position: 'relative', aspectRatio: '16/9', background: '#080808', overflow: 'hidden' }}
        className="scanlines"
      >
        {!streamErr ? (
          <img
            src="/api/stream"
            alt="live"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'relative', zIndex: 2 }}
            onError={() => setStreamErr(true)}
          />
        ) : (
          /* ─── Demo Canvas (Vercel / no backend) ─── */
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2,
            background: 'radial-gradient(ellipse at 40% 55%, #1A1005 0%, #080808 75%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Ground grid */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}>
              <defs>
                <pattern id="g" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#F59E0B" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#g)" />
            </svg>

            {/* Geo-fence polygon */}
            <div style={{
              position: 'absolute',
              top: '10%', left: '20%', right: '6%', bottom: '6%',
              border: `1.5px solid ${isViol ? 'rgba(255,68,68,0.55)' : 'rgba(245,158,11,0.45)'}`,
              borderRadius: 4,
              background: isViol ? 'rgba(255,68,68,0.04)' : 'rgba(245,158,11,0.03)',
              boxShadow: isViol
                ? '0 0 30px rgba(255,68,68,0.12), inset 0 0 30px rgba(255,68,68,0.05)'
                : '0 0 20px rgba(245,158,11,0.08)',
              transition: 'all 0.5s ease',
            }}>
              {/* Zone label */}
              <div style={{
                position: 'absolute', top: 8, left: 10,
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <MapPin size={11} color={isViol ? '#FF6B6B' : '#FBBF24'} strokeWidth={2} />
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: isViol ? 'rgba(255,107,107,0.8)' : 'rgba(251,191,36,0.75)',
                }}>
                  No-Parking Zone · Polygon Active
                </span>
              </div>

              {/* Vehicle bounding box */}
              <div style={{ position: 'absolute', top: '38%', left: '26%' }}>
                <BBox isViol={isViol}>
                  <div style={{
                    width: 190, height: 86,
                    background: isViol ? 'rgba(255,68,68,0.06)' : 'rgba(245,158,11,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {/* Car silhouette */}
                    <div style={{
                      width: 110, height: 52,
                      background: 'linear-gradient(160deg, #27272A 0%, #18181B 100%)',
                      borderRadius: 8,
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22,
                    }}>🚗</div>
                  </div>
                </BBox>

                {/* Detection chip — floating above box */}
                <div style={{
                  position: 'absolute', top: -36, left: 0,
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: isViol ? 'rgba(15,5,5,0.92)' : 'rgba(10,8,2,0.92)',
                  border: `1px solid ${isViol ? 'rgba(255,68,68,0.35)' : 'rgba(245,158,11,0.35)'}`,
                  borderRadius: 5,
                  padding: '5px 10px',
                  backdropFilter: 'blur(12px)',
                  whiteSpace: 'nowrap',
                }}>
                  <span style={{ fontSize: 10, color: '#71717A', fontFamily: 'JetBrains Mono, monospace' }}>#1 · CAR</span>
                  <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }} />
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: isViol ? '#FF6B6B' : '#FBBF24',
                  }}>MH12AB1234</span>
                  <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }} />
                  <DwellRing sec={dwell} max={120} />
                </div>
              </div>
            </div>

            {/* Violation flash banner */}
            {isViol && (
              <div style={{
                position: 'absolute', top: 10, right: 10, zIndex: 10,
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(20,5,5,0.9)',
                border: '1px solid rgba(255,68,68,0.4)',
                borderRadius: 5,
                padding: '5px 12px',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 0 16px rgba(255,68,68,0.15)',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF4444', display: 'inline-block', animation: 'blink 0.8s ease-in-out infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#FF6B6B', letterSpacing: '0.08em' }}>VIOLATION CONFIRMED</span>
              </div>
            )}

            {/* Bottom metadata */}
            <div style={{
              position: 'absolute', bottom: 10, right: 10,
              background: 'rgba(8,8,8,0.8)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 5, padding: '4px 10px',
              backdropFilter: 'blur(8px)',
            }}>
              <span style={{ fontSize: 10, color: '#3F3F46', fontFamily: 'JetBrains Mono, monospace' }}>
                CAM-01 · YOLO11 · 10fps · CPU
              </span>
            </div>
          </div>
        )}

        {/* LIVE badge overlay */}
        <div style={{
          position: 'absolute', top: 10, left: 10, zIndex: 20,
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(8,8,8,0.85)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 5, padding: '4px 10px',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 0 12px rgba(245,158,11,0.1)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B', display: 'inline-block', animation: 'blink 1s ease-in-out infinite' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#FBBF24', letterSpacing: '0.1em' }}>LIVE</span>
        </div>
      </div>
    </div>
  )
}
