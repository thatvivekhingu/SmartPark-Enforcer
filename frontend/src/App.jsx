import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Header from './components/Header'
import LiveFeed from './components/LiveFeed'
import ActiveViolations from './components/ActiveViolations'
import DigitalChallanCard from './components/DigitalChallanCard'
import { Eye, ShieldAlert, Clock3, FileCheck } from 'lucide-react'

/* ── Stat strip card ─────────────────────────────── */
function Stat({ icon: Icon, label, value, accent = '#F59E0B' }) {
  return (
    <div className="stat-box" style={{ flex: 1 }}>
      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 60, height: 60,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, position: 'relative' }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: `${accent}14`,
          border: `1px solid ${accent}28`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={14} color={accent} strokeWidth={2} />
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#52525B' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: accent, letterSpacing: '-0.02em', lineHeight: 1, position: 'relative' }}>
        {value}
      </div>
    </div>
  )
}

const DEFAULT_VIOLATIONS = [{
  id: 1, violation_id: 'VIOL-20260819-01', track_id: 1,
  vehicle_type: 'car', vehicle_number: 'MH12AB1234',
  camera_id: 'CAM-01', location: 'No-Parking Bay 1',
  timestamp: '2026-08-19 22:45:10', dwell_time: 125.0,
  sha256_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  status: 'CONFIRMED',
}]

const DEFAULT_CHALLAN = {
  id: 1, challan_id: 'CHAL-20260819-01', violation_id: 'VIOL-20260819-01',
  vehicle_number: 'MH12AB1234', vehicle_type: 'car',
  issued_at: '2026-08-19 22:45:12', fine_amount: 500,
  sha256_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  status: 'ISSUED',
}

export default function App() {
  const [violations, setViolations]       = useState(DEFAULT_VIOLATIONS)
  const [latestChallan, setLatestChallan] = useState(DEFAULT_CHALLAN)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [vR, cR] = await Promise.allSettled([
          axios.get('/api/violations',      { timeout: 2500 }),
          axios.get('/api/challans/latest', { timeout: 2500 }),
        ])
        if (vR.status === 'fulfilled' && Array.isArray(vR.value.data) && vR.value.data.length)
          setViolations(vR.value.data)
        if (cR.status === 'fulfilled' && cR.value.data?.challan_id)
          setLatestChallan(cR.value.data)
      } catch {}
    }
    fetch()
    const id = setInterval(fetch, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0C0C0E' }}>
      <Header />

      <main style={{ flex: 1, padding: '20px', maxWidth: 1440, margin: '0 auto', width: '100%' }}>

        {/* ── Stats strip ──────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <Stat icon={Eye}        label="Tracked"   value={1}                   accent="#22D3EE" />
          <Stat icon={Clock3}     label="In Zone"   value={1}                   accent="#F59E0B" />
          <Stat icon={ShieldAlert} label="Violations" value={violations.length} accent="#FF4444" />
          <Stat icon={FileCheck}  label="Challans"  value={violations.length}   accent="#34D399" />
        </div>

        {/* ── Main 2-col layout ────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)',
          gap: 20,
          alignItems: 'start',
        }}
          className="responsive-grid"
        >
          {/* Left: Live Feed */}
          <LiveFeed />

          {/* Right: Violations + Challan */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ActiveViolations violations={violations} />
            <DigitalChallanCard challan={latestChallan} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '12px 24px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: '#080808',
      }}>
        <span style={{ fontSize: 11, color: '#3F3F46' }}>
          SmartPark-Enforcer AI v2.0 &bull; YOLO11 + ByteTrack + Shapely Polygon Geo-Fencing
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#27272A' }}>
          SHA-256 Tamper-Evident Challan System
        </span>
      </footer>

      {/* Inline responsive override */}
      <style>{`
        @media (max-width: 900px) {
          .responsive-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
