import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { MonitorPlay, Maximize2, MapPin } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || ''

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

export default function LiveFeed() {
  const [streamErr, setStreamErr] = useState(false)
  const [trackers, setTrackers] = useState([])
  const [geoFenceOn, setGeoFenceOn] = useState(true)
  const imgRef = useRef(null)

  useEffect(() => {
    const fetchTrackers = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/active-trackers`, { timeout: 3000 })
        if (Array.isArray(res.data))
          setTrackers(res.data)
      } catch {}
    }
    fetchTrackers()
    const id = setInterval(fetchTrackers, 2000)
    return () => clearInterval(id)
  }, [])

  const mainTracker = trackers.find(t => t.inside_geofence && !t.violation_issued) || trackers[0]
  const dwellSec = mainTracker ? Math.round(mainTracker.dwell_time) : 0

  return (
    <div className="card animate-fadeUp" style={{ animationDelay: '0ms' }}>
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

      <div style={{ position: 'relative', aspectRatio: '16/9', background: '#080808', overflow: 'hidden' }}
        className="scanlines"
      >
        {!streamErr ? (
          <img
            ref={imgRef}
            src={`${API_BASE}/api/stream`}
            alt="live"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'relative', zIndex: 2 }}
            onError={() => setStreamErr(true)}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2,
            background: 'radial-gradient(ellipse at 40% 55%, #1A1005 0%, #080808 75%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 12,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MonitorPlay size={20} color="#F59E0B" strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: 13, color: '#52525B', fontWeight: 500 }}>Stream Offline</span>
            <span style={{ fontSize: 11, color: '#3F3F46' }}>Starting video source...</span>
            {mainTracker && (
              <div style={{
                marginTop: 8,
                padding: '8px 14px', borderRadius: 6,
                background: 'rgba(245,158,11,0.06)',
                border: '1px solid rgba(245,158,11,0.15)',
              }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#FBBF24' }}>
                  #{mainTracker.track_id} {mainTracker.vehicle_type.toUpperCase()} | {mainTracker.plate_number} | {Math.round(mainTracker.dwell_time)}s
                </span>
              </div>
            )}
          </div>
        )}

        <div style={{
          position: 'absolute', top: 10, left: 10, zIndex: 20,
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(8,8,8,0.85)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 5, padding: '4px 10px',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 0 12px rgba(245,158,11,0.1)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: streamErr ? '#FF4444' : '#F59E0B', display: 'inline-block', animation: 'blink 1s ease-in-out infinite' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: streamErr ? '#FF6B6B' : '#FBBF24', letterSpacing: '0.1em' }}>
            {streamErr ? 'OFFLINE' : 'LIVE'}
          </span>
        </div>
      </div>
    </div>
  )
}
