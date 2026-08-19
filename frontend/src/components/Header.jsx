import React, { useState, useEffect } from 'react'
import { ShieldAlert, Activity, Clock, Wifi, Zap, Radio } from 'lucide-react'

function LiveClock() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id) }, [])
  const p = n => String(n).padStart(2, '0')
  return (
    <span className="font-mono" style={{ fontSize: 13, fontWeight: 600, color: '#FBBF24', letterSpacing: '0.04em', fontVariantNumeric: 'tabular-nums' }}>
      {p(t.getHours())}:{p(t.getMinutes())}:{p(t.getSeconds())}
      <span style={{ marginLeft: 8, fontSize: 11, color: '#52525B', fontWeight: 500 }}>
        {t.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
      </span>
    </span>
  )
}

export default function Header({ wsConnected = false, health = {} }) {
  const ocrReady = health.ocr_engine === 'READY'
  return (
    <header style={{
      background: 'linear-gradient(180deg, #0F0F12 0%, #09090B 100%)',
      borderBottom: '1px solid rgba(245,158,11,0.08)',
      height: 54,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(12px)',
    }}>
      {/* Left: Logo + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 34, height: 34,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #451A03 0%, #B45309 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 12px rgba(245,158,11,0.2)',
          flexShrink: 0,
        }}>
          <ShieldAlert size={17} color="#FEF3C7" strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#FAFAFA', letterSpacing: '-0.01em' }}>
              SmartPark
            </span>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#F59E0B', letterSpacing: '-0.01em' }}>
              Enforcer
            </span>
          </div>
          <div style={{ fontSize: 9, color: '#3F3F46', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: -1 }}>
            AI Enforcement Command Center
          </div>
        </div>
      </div>

      {/* Right: Status pills + Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* YOLO status */}
        <div className="pill pill-cyan" style={{ gap: 6 }}>
          <Zap size={10} strokeWidth={2.5} />
          <span>YOLO11 + ByteTrack</span>
        </div>

        {/* OCR status */}
        <div className={`pill ${ocrReady ? 'pill-jade' : 'pill-slate'}`} style={{ gap: 6 }}>
          <Radio size={10} strokeWidth={2.5} />
          <span>OCR {ocrReady ? 'READY' : 'OFF'}</span>
        </div>

        {/* Dwell limit */}
        <div className="pill pill-red" style={{ gap: 6 }}>
          <Activity size={10} strokeWidth={2.5} />
          <span>120s DWELL</span>
        </div>

        {/* WS */}
        <div className={`pill ${wsConnected ? 'pill-jade' : 'pill-slate'}`} style={{ gap: 6 }}>
          <Wifi size={10} strokeWidth={2.5} />
          <span>{wsConnected ? 'LIVE' : 'WS OFF'}</span>
        </div>

        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.06)', margin: '0 4px' }} />

        <LiveClock />
      </div>
    </header>
  )
}
