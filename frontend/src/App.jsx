import React, { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import Header from './components/Header'
import LiveFeed from './components/LiveFeed'
import ActiveViolations from './components/ActiveViolations'
import DigitalChallanCard from './components/DigitalChallanCard'
import { Eye, ShieldAlert, Clock3, FileCheck, Activity, Radio, Zap } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || ''

function Stat({ icon: Icon, label, value, accent = '#F59E0B', sub }) {
  return (
    <div className="stat-box" style={{ flex: 1, minWidth: 140 }}>
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 56, height: 56, borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}12 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: `${accent}12`,
            border: `1px solid ${accent}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={13} color={accent} strokeWidth={2.2} />
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#52525B' }}>
            {label}
          </span>
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color: accent, letterSpacing: '-0.03em', lineHeight: 1, fontFamily: "'JetBrains Mono', monospace", position: 'relative' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 10, color: '#3F3F46', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function SystemBar({ health }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16, padding: '8px 24px',
      background: 'rgba(0,0,0,0.3)',
      borderBottom: '1px solid rgba(255,255,255,0.03)',
      fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
    }}>
      <span style={{ color: '#52525B' }}>SYSTEM</span>
      {[
        { label: 'DB', ok: health.database === 'ok' || health.status === 'online' },
        { label: 'YOLO', ok: true },
        { label: 'OCR', ok: health.ocr_engine === 'READY' },
        { label: 'WS', ok: health.websocket_clients !== undefined },
      ].map(s => (
        <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: s.ok ? '#34D399' : '#52525B',
            boxShadow: s.ok ? '0 0 6px rgba(52,211,153,0.4)' : 'none',
          }} />
          <span style={{ color: s.ok ? '#71717A' : '#3F3F46' }}>{s.label}</span>
        </div>
      ))}
      <span style={{ marginLeft: 'auto', color: '#27272A' }}>
        {health.device === 'cuda' ? 'GPU' : 'CPU'} | {health.yolo_model || 'yolo11n.pt'}
      </span>
    </div>
  )
}

export default function App() {
  const [violations, setViolations] = useState([])
  const [latestChallan, setLatestChallan] = useState(null)
  const [stats, setStats] = useState({ tracked: 0, in_zone: 0, violations: 0, challans: 0 })
  const [health, setHealth] = useState({})
  const [wsConnected, setWsConnected] = useState(false)
  const [trackers, setTrackers] = useState([])
  const wsRef = useRef(null)

  const fetchData = useCallback(async () => {
    try {
      const [vR, cR, sR, hR, tR] = await Promise.allSettled([
        axios.get(`${API_BASE}/api/violations`, { timeout: 5000 }),
        axios.get(`${API_BASE}/api/challans/latest`, { timeout: 5000 }),
        axios.get(`${API_BASE}/api/stats`, { timeout: 5000 }),
        axios.get(`${API_BASE}/api/health`, { timeout: 5000 }),
        axios.get(`${API_BASE}/api/active-trackers`, { timeout: 5000 }),
      ])
      if (vR.status === 'fulfilled' && Array.isArray(vR.value.data)) setViolations(vR.value.data)
      if (cR.status === 'fulfilled' && cR.value.data) setLatestChallan(cR.value.data)
      if (sR.status === 'fulfilled' && sR.value.data) setStats(sR.value.data)
      if (hR.status === 'fulfilled' && hR.value.data) setHealth(hR.value.data)
      if (tR.status === 'fulfilled' && Array.isArray(tR.value.data)) setTrackers(tR.value.data)
    } catch {}
  }, [])

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, 2000)
    return () => clearInterval(id)
  }, [fetchData])

  useEffect(() => {
    const wsUrl = (API_BASE || window.location.origin.replace(/:\d+$/, ':8000')).replace(/^http/, 'ws') + '/ws'
    let ws = null, timer = null
    function connect() {
      try {
        ws = new WebSocket(wsUrl)
        wsRef.current = ws
        ws.onopen = () => setWsConnected(true)
        ws.onmessage = (evt) => {
          try {
            const msg = JSON.parse(evt.data)
            if (msg.event === 'VIOLATION_CREATED' && msg.data) {
              setViolations(prev => [msg.data, ...prev.filter(v => v.violation_id !== msg.data.violation_id)])
              setLatestChallan(msg.data)
            }
          } catch {}
        }
        ws.onclose = () => { setWsConnected(false); timer = setTimeout(connect, 3000) }
        ws.onerror = () => ws.close()
      } catch {}
    }
    connect()
    return () => { if (ws) ws.close(); if (timer) clearTimeout(timer) }
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#09090B' }}>
      <Header wsConnected={wsConnected} health={health} />
      <SystemBar health={health} />

      <main style={{ flex: 1, padding: '16px 20px', maxWidth: 1600, margin: '0 auto', width: '100%' }}>

        {/* === STAT STRIP === */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <Stat icon={Eye} label="Vehicles" value={stats.tracked} accent="#22D3EE" sub="tracked right now" />
          <Stat icon={Clock3} label="In Zone" value={stats.in_zone} accent="#F59E0B" sub="inside geofence" />
          <Stat icon={ShieldAlert} label="Violations" value={stats.violations} accent="#EF4444" sub="total confirmed" />
          <Stat icon={FileCheck} label="Challans" value={stats.challans} accent="#34D399" sub="digital challans" />
          <Stat icon={Activity} label="OCR" value={stats.ocr_status === 'READY' ? 'ON' : 'OFF'} accent={stats.ocr_status === 'READY' ? '#34D399' : '#52525B'} sub="EasyOCR engine" />
        </div>

        {/* === MAIN LAYOUT: VIDEO + SIDEBAR === */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: 16,
          alignItems: 'start',
        }} className="main-grid">

          {/* LEFT: Video Feed + Violations Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
            <LiveFeed trackers={trackers} />
            <ActiveViolations violations={violations} />
          </div>

          {/* RIGHT: Challan + Active Trackers + System */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {latestChallan && <DigitalChallanCard challan={latestChallan} />}

            {/* Active Tracker List */}
            <div className="card animate-fadeUp" style={{ animationDelay: '100ms' }}>
              <div className="card-header">
                <div className="card-title">
                  <Eye size={13} color="#22D3EE" strokeWidth={2.2} />
                  Live Tracker
                </div>
                <span className="pill pill-cyan">{trackers.length} active</span>
              </div>
              <div style={{ padding: '8px 0', maxHeight: 220, overflowY: 'auto' }}>
                {trackers.length === 0 ? (
                  <div style={{ padding: '28px 18px', textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#3F3F46' }}>No active vehicles</div>
                    <div style={{ fontSize: 10, color: '#27272A', marginTop: 4 }}>Waiting for detections...</div>
                  </div>
                ) : trackers.map(t => {
                  const pct = Math.min(t.dwell_time / 120, 1)
                  const isViol = t.violation_issued
                  const inside = t.inside_geofence
                  return (
                    <div key={t.track_id} style={{
                      display: 'grid', gridTemplateColumns: '32px 1fr 60px',
                      alignItems: 'center', gap: 10,
                      padding: '8px 16px',
                      borderBottom: '1px solid rgba(255,255,255,0.02)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: 6,
                        background: isViol ? 'rgba(239,68,68,0.1)' : inside ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isViol ? 'rgba(239,68,68,0.2)' : inside ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                        color: isViol ? '#F87171' : inside ? '#FBBF24' : '#52525B',
                      }}>
                        {t.track_id}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#A1A1AA', textTransform: 'capitalize' }}>
                          {t.vehicle_type}
                          <span style={{ marginLeft: 6, fontSize: 10, color: '#52525B', fontWeight: 500 }}>
                            {inside ? 'IN ZONE' : 'MOVING'}
                          </span>
                        </div>
                        <div className="font-mono" style={{ fontSize: 10, color: '#3F3F46', marginTop: 1 }}>
                          {t.plate_number !== 'UNKNOWN' ? t.plate_number : 'reading...'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="font-mono" style={{
                          fontSize: 12, fontWeight: 700,
                          color: isViol ? '#F87171' : pct > 0.7 ? '#FBBF24' : '#71717A',
                        }}>
                          {Math.round(t.dwell_time)}s
                        </div>
                        <div style={{ width: '100%', height: 2, borderRadius: 1, background: 'rgba(255,255,255,0.05)', marginTop: 3 }}>
                          <div style={{
                            height: '100%', borderRadius: 1,
                            width: `${pct * 100}%`,
                            background: isViol ? '#EF4444' : '#F59E0B',
                            transition: 'width 0.3s ease',
                          }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* SHA-256 Legend */}
            <div className="card animate-fadeUp" style={{ animationDelay: '150ms' }}>
              <div className="card-header" style={{ padding: '10px 16px' }}>
                <div className="card-title" style={{ fontSize: 10 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Evidence Integrity
                </div>
              </div>
              <div style={{ padding: '12px 16px', fontSize: 11, color: '#52525B', lineHeight: 1.7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 2, background: '#F59E0B', flexShrink: 0 }} />
                  <span><strong style={{ color: '#A1A1AA' }}>SHA-256</strong> hash computed from actual evidence files on disk</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 2, background: '#34D399', flexShrink: 0 }} />
                  <span><strong style={{ color: '#A1A1AA' }}>Tamper-evident</strong> — any file modification invalidates hash</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 2, background: '#22D3EE', flexShrink: 0 }} />
                  <span><strong style={{ color: '#A1A1AA' }}>Real-time</strong> WebSocket violation notifications</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* === FOOTER === */}
      <footer style={{
        padding: '10px 24px',
        borderTop: '1px solid rgba(255,255,255,0.03)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: '#07070A',
      }}>
        <span style={{ fontSize: 10, color: '#27272A', fontWeight: 500, letterSpacing: '0.04em' }}>
          SmartPark-Enforcer AI v3.0 &mdash; YOLO11 + ByteTrack + EasyOCR + Shapely Geo-Fencing + SHA-256
        </span>
        <span className="font-mono" style={{ fontSize: 10, color: '#1C1C1F' }}>
          WS {wsConnected ? 'CONNECTED' : 'DISCONNECTED'}
        </span>
      </footer>

      <style>{`
        @media (max-width: 1024px) {
          .main-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
