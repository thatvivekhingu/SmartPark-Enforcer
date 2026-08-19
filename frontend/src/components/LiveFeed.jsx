import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { MonitorPlay, Maximize2, MapPin, AlertTriangle, Clock } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || ''

function DwellRing({ sec = 0, max = 120, size = 44 }) {
  const r = (size / 2) - 4
  const circ = 2 * Math.PI * r
  const pct = Math.min(sec / max, 1)
  const isViol = pct >= 1
  const color = isViol ? '#EF4444' : pct > 0.6 ? '#F59E0B' : '#22D3EE'
  const txtSize = size > 50 ? 11 : 9

  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={2.5} />
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth={2.5}
        strokeDasharray={`${pct * circ} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dasharray 0.8s ease, stroke 0.4s ease', filter: `drop-shadow(0 0 4px ${color}60)` }}
      />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        fontSize={txtSize} fontFamily="'JetBrains Mono', monospace" fontWeight={700}
        fill={color}
      >{sec}s</text>
    </svg>
  )
}

export default function LiveFeed({ trackers = [] }) {
  const [streamErr, setStreamErr] = useState(false)
  const [showViolFlash, setShowViolFlash] = useState(false)
  const prevViolCount = useRef(0)

  const mainTracker = trackers.find(t => t.inside_geofence && !t.violation_issued) || trackers[0]
  const dwellSec = mainTracker ? Math.round(mainTracker.dwell_time) : 0
  const isViol = dwellSec >= 120

  useEffect(() => {
    const violCount = trackers.filter(t => t.violation_issued).length
    if (violCount > prevViolCount.current) {
      setShowViolFlash(true)
      setTimeout(() => setShowViolFlash(false), 3000)
    }
    prevViolCount.current = violCount
  }, [trackers])

  return (
    <div className="card animate-fadeUp" style={{ animationDelay: '0ms' }}>
      <div className="card-header" style={{ padding: '10px 18px' }}>
        <div className="card-title">
          <MonitorPlay size={13} color="#F59E0B" strokeWidth={2.2} />
          Live Video Feed
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="pill pill-cyan" style={{ fontSize: 9, padding: '2px 8px' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22D3EE', display: 'inline-block', animation: 'blink 1.2s ease-in-out infinite' }} />
            GEO-FENCE
          </span>
          <span className="pill pill-amber" style={{ fontSize: 9, padding: '2px 8px' }}>
            <MapPin size={9} strokeWidth={2.5} />
            NO-PARKING
          </span>
        </div>
      </div>

      {/* Video Container */}
      <div style={{ position: 'relative', aspectRatio: '16/9', background: '#050507', overflow: 'hidden' }}
        className="video-grid scanlines"
      >
        {/* Corner brackets */}
        <div className="corner-bracket corner-tl" />
        <div className="corner-bracket corner-tr" />
        <div className="corner-bracket corner-bl" />
        <div className="corner-bracket corner-br" />

        {!streamErr ? (
          <img
            src={`${API_BASE}/api/stream`}
            alt="live CCTV feed"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'relative', zIndex: 1 }}
            onError={() => setStreamErr(true)}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2,
            background: 'radial-gradient(ellipse at 50% 50%, #111113 0%, #050507 100%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 12,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'rgba(245,158,11,0.06)',
              border: '1px solid rgba(245,158,11,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MonitorPlay size={22} color="#F59E0B" strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: 13, color: '#52525B', fontWeight: 600 }}>Connecting to video source...</span>
            {mainTracker && (
              <div style={{
                padding: '6px 12px', borderRadius: 6,
                background: 'rgba(245,158,11,0.05)',
                border: '1px solid rgba(245,158,11,0.12)',
                marginTop: 4,
              }}>
                <span className="font-mono" style={{ fontSize: 11, color: '#FBBF24' }}>
                  #{mainTracker.track_id} {mainTracker.vehicle_type.toUpperCase()} | {Math.round(mainTracker.dwell_time)}s dwell
                </span>
              </div>
            )}
          </div>
        )}

        {/* LIVE Badge - Top Left */}
        <div style={{
          position: 'absolute', top: 10, left: 10, zIndex: 20,
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(0,0,0,0.75)',
          border: `1px solid ${streamErr ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.25)'}`,
          borderRadius: 5, padding: '4px 10px',
          backdropFilter: 'blur(8px)',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: streamErr ? '#EF4444' : '#F59E0B',
            display: 'inline-block',
            animation: 'blink 1s ease-in-out infinite',
          }} />
          <span className="font-mono" style={{ fontSize: 10, fontWeight: 700, color: streamErr ? '#F87171' : '#FBBF24', letterSpacing: '0.1em' }}>
            {streamErr ? 'OFFLINE' : 'LIVE'}
          </span>
        </div>

        {/* Detection Info - Top Right */}
        {mainTracker && !streamErr && (
          <div style={{
            position: 'absolute', top: 10, right: 10, zIndex: 20,
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,0,0,0.75)',
            border: `1px solid ${isViol ? 'rgba(239,68,68,0.3)' : 'rgba(34,211,238,0.2)'}`,
            borderRadius: 5, padding: '5px 10px',
            backdropFilter: 'blur(8px)',
          }}>
            <span className="font-mono" style={{ fontSize: 10, color: '#71717A' }}>
              #{mainTracker.track_id} {mainTracker.vehicle_type.toUpperCase()}
            </span>
            <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }} />
            <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: '#D4D4D8' }}>
              {mainTracker.plate_number !== 'UNKNOWN' ? mainTracker.plate_number : 'reading...'}
            </span>
            <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }} />
            <DwellRing sec={dwellSec} max={120} size={38} />
          </div>
        )}

        {/* Violation Flash Banner */}
        {showViolFlash && (
          <div style={{
            position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 25,
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(127,29,29,0.9)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: 6, padding: '6px 16px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 24px rgba(239,68,68,0.2)',
            animation: 'fadeUp 0.3s ease-out',
          }}>
            <AlertTriangle size={14} color="#FCA5A5" strokeWidth={2.5} />
            <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: '#FCA5A5', letterSpacing: '0.08em' }}>
              VIOLATION CONFIRMED
            </span>
          </div>
        )}

        {/* Bottom Info Bar */}
        <div style={{
          position: 'absolute', bottom: 8, left: 10, zIndex: 20,
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(0,0,0,0.6)',
          borderRadius: 4, padding: '3px 8px',
          backdropFilter: 'blur(6px)',
        }}>
          <span className="font-mono" style={{ fontSize: 9, color: '#3F3F46' }}>
            CAM-01 | 1280x720 | 10fps
          </span>
          <span style={{ width: 1, height: 8, background: 'rgba(255,255,255,0.06)' }} />
          <span className="font-mono" style={{ fontSize: 9, color: '#3F3F46' }}>
            {trackers.length} vehicle{trackers.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  )
}
