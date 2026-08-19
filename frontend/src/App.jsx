import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Header from './components/Header'
import LiveFeed from './components/LiveFeed'
import ActiveViolations from './components/ActiveViolations'
import DigitalChallanCard from './components/DigitalChallanCard'

const DEFAULT_VIOLATIONS = [
  {
    id: 1,
    violation_id: 'VIOL-20260819-01',
    track_id: 1,
    vehicle_type: 'car',
    vehicle_number: 'MH12AB1234',
    camera_id: 'CAM-01',
    location: 'No-Parking Bay 1',
    timestamp: '2026-08-19 22:45:10',
    dwell_time: 125.0,
    violation_type: 'Illegal Parking (>120s)',
    evidence_image: '',
    plate_image: '',
    sha256_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'CONFIRMED',
  }
]

const DEFAULT_CHALLAN = {
  id: 1,
  challan_id: 'CHAL-20260819-01',
  violation_id: 'VIOL-20260819-01',
  vehicle_number: 'MH12AB1234',
  vehicle_type: 'car',
  issued_at: '2026-08-19 22:45:12',
  fine_amount: 500,
  sha256_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  evidence_image: '',
  status: 'ISSUED',
}

export default function App() {
  const [violations, setViolations]     = useState(DEFAULT_VIOLATIONS)
  const [latestChallan, setLatestChallan] = useState(DEFAULT_CHALLAN)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vRes, cRes] = await Promise.allSettled([
          axios.get('/api/violations',      { timeout: 2500 }),
          axios.get('/api/challans/latest', { timeout: 2500 }),
        ])
        if (vRes.status === 'fulfilled' && Array.isArray(vRes.value.data) && vRes.value.data.length > 0)
          setViolations(vRes.value.data)
        if (cRes.status === 'fulfilled' && cRes.value.data?.challan_id)
          setLatestChallan(cRes.value.data)
      } catch {}
    }
    fetchData()
    const id = setInterval(fetchData, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0B0F17', color: '#E2E8F0' }}>
      <Header />

      <main className="flex-1 p-5 w-full max-w-screen-xl mx-auto">
        {/* Responsive 2-column grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* Left — Live Feed (takes more space) */}
          <div className="xl:col-span-7 flex flex-col gap-5">
            <LiveFeed />
          </div>

          {/* Right — Violations + Challan */}
          <div className="xl:col-span-5 flex flex-col gap-5">
            <ActiveViolations violations={violations} />
            <DigitalChallanCard challan={latestChallan} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-3 flex items-center justify-between text-[11px]"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: '#334155', background: '#0B0F17' }}
      >
        <span>SmartPark-Enforcer AI v2.0 &bull; Ultralytics YOLO11 + ByteTrack + Shapely</span>
        <span className="font-mono">SHA-256 Tamper-Evident Challan System</span>
      </footer>
    </div>
  )
}
