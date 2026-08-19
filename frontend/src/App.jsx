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
    camera_id: 'CAM-01 (Terminal Gate)',
    location: 'No-Parking Bay 1',
    timestamp: '2026-08-19 22:45:10',
    dwell_time: 125.0,
    violation_type: 'Illegal Parking (>120s)',
    evidence_image: '',
    plate_image: '',
    sha256_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'CONFIRMED'
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
  status: 'ISSUED'
}

export default function App() {
  const [violations, setViolations] = useState(DEFAULT_VIOLATIONS)
  const [latestChallan, setLatestChallan] = useState(DEFAULT_CHALLAN)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [violRes, chalRes] = await Promise.allSettled([
          axios.get('/api/violations', { timeout: 2500 }),
          axios.get('/api/challans/latest', { timeout: 2500 })
        ])
        if (violRes.status === 'fulfilled' && Array.isArray(violRes.value.data) && violRes.value.data.length > 0) {
          setViolations(violRes.value.data)
        }
        if (chalRes.status === 'fulfilled' && chalRes.value.data) {
          setLatestChallan(chalRes.value.data)
        }
      } catch (err) {
        // Fallback default demo data preserved for Vercel
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live CCTV Stream */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <LiveFeed />
        </div>

        {/* Right Column: Confirmed Violations & Latest Digital Challan */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <ActiveViolations violations={violations} />
          <DigitalChallanCard challan={latestChallan} />
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-900 px-6 py-3 text-center text-xs text-slate-500 font-mono">
        SmartPark-Enforcer AI v2.0 &bull; 120s Dwell-Time Engine &bull; SHA-256 Tamper-Evident Security
      </footer>
    </div>
  )
}
