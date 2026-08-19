import React, { useState, useEffect } from 'react'
import { ShieldAlert, Activity, Clock, Wifi, Zap } from 'lucide-react'

function LiveClock() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id) }, [])
  const p = n => String(n).padStart(2, '0')
  return (
    <span className="font-mono text-[13px] tabular-nums" style={{ color: '#FBBF24', letterSpacing: '0.05em' }}>
      {p(t.getHours())}:{p(t.getMinutes())}:{p(t.getSeconds())}
      <span className="ml-2 text-[11px]" style={{ color: '#52525B' }}>
        {t.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
      </span>
    </span>
  )
}

export default function Header() {
  return (
    <header style={{
      background: 'linear-gradient(180deg, #111113 0%, #0C0C0E 100%)',
      borderBottom: '1px solid rgba(245,158,11,0.12)',
      height: 58,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Left: Logo + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Logo mark */}
        <div style={{
          width: 36, height: 36,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #451A03 0%, #D97706 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 16px rgba(245,158,11,0.25)',
          flexShrink: 0,
        }}>
          <ShieldAlert size={18} color="#FEF3C7" strokeWidth={2} />
        </div>

        {/* Text */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#FAFAFA', letterSpacing: '-0.01em' }}>
              SmartPark-Enforcer
            </span>
            <span style={{ fontSize: 11, color: '#52525B', fontWeight: 500 }}>·</span>
            <span style={{ fontSize: 12, color: '#71717A', fontWeight: 500 }}>AI Command Center</span>
          </div>
          <div style={{ fontSize: 10, color: '#3F3F46', fontWeight: 500, letterSpacing: '0.04em', marginTop: 1 }}>
            NO-PARKING GEO-FENCE &amp; DIGITAL CHALLAN ENFORCEMENT
          </div>
        </div>
      </div>

      {/* Right: Status + Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* CAM LIVE */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 99,
          background: 'rgba(34,211,238,0.07)',
          border: '1px solid rgba(34,211,238,0.18)',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#22D3EE',
            display: 'inline-block',
            animation: 'blink 1.2s ease-in-out infinite',
          }} />
          <Wifi size={12} color="#22D3EE" strokeWidth={2} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#22D3EE', letterSpacing: '0.06em' }}>
            CAM-01 LIVE
          </span>
        </div>

        {/* YOLO */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 99,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <Zap size={12} color="#71717A" strokeWidth={2} />
          <span style={{ fontSize: 11, fontWeight: 500, color: '#71717A' }}>YOLO11 + ByteTrack</span>
        </div>

        {/* Dwell */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 99,
          background: 'rgba(255,68,68,0.07)',
          border: '1px solid rgba(255,68,68,0.18)',
        }}>
          <Activity size={12} color="#FF6B6B" strokeWidth={2} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#FF6B6B', letterSpacing: '0.04em' }}>120s DWELL LIMIT</span>
        </div>

        <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Clock size={12} color="#52525B" strokeWidth={1.8} />
          <LiveClock />
        </div>
      </div>
    </header>
  )
}
