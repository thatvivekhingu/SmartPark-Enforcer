import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Header from './components/Header'
import LiveFeed from './components/LiveFeed'
import ActiveViolations from './components/ActiveViolations'
import DigitalChallanCard from './components/DigitalChallanCard'

export default function App() {
  const [violations, setViolations] = useState([])
  const [latestChallan, setLatestChallan] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [violRes, chalRes] = await Promise.all([
          axios.get('/api/violations'),
          axios.get('/api/challans/latest')
        ])
        setViolations(violRes.data || [])
        setLatestChallan(chalRes.data || null)
      } catch (err) {
        console.error("API Polling Error:", err)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 2000)
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
