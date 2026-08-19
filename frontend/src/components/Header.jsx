import React, { useState, useEffect } from 'react'
import { ShieldAlert, Radio, Cpu, Clock } from 'lucide-react'

function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const fmt = (n) => String(n).padStart(2, '0')
  return (
    <span className="font-mono text-[13px] text-slate-300 tabular-nums tracking-wider">
      {fmt(time.getHours())}:{fmt(time.getMinutes())}:{fmt(time.getSeconds())}
      <span className="text-slate-500 ml-1 text-[11px]">
        {time.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
      </span>
    </span>
  )
}

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-0 border-b"
      style={{
        background: 'linear-gradient(180deg, #0B0F17 0%, #0E1420 100%)',
        borderColor: 'rgba(255,255,255,0.07)',
        height: '60px',
      }}
    >
      {/* Left — Logo + Breadcrumb */}
      <div className="flex items-center gap-4">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg"
          style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)' }}
        >
          <ShieldAlert className="w-5 h-5 text-white" strokeWidth={1.8} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold text-slate-50 tracking-tight">SmartPark-Enforcer</span>
            <span className="text-slate-600 text-sm">/</span>
            <span className="text-[13px] text-slate-400 font-medium">Command Center</span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium mt-0">
            Automated No-Parking Geo-Fence &amp; Digital Challan System
          </p>
        </div>
      </div>

      {/* Right — Status Indicators + Clock */}
      <div className="flex items-center gap-3">
        {/* Live Stream Status */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] font-medium"
          style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
        >
          <Radio className="w-3.5 h-3.5 text-primary-400" strokeWidth={1.8} />
          <span className="text-slate-400">CAM-01</span>
          <span className="flex items-center gap-1 text-primary-400">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulseSlow" />
            LIVE
          </span>
        </div>

        {/* Model Status */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] font-medium"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <Cpu className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.8} />
          <span className="text-slate-400">YOLO11 + ByteTrack</span>
          <span className="text-slate-300 font-semibold">CPU</span>
        </div>

        {/* Dwell Alert */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] font-semibold"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-danger-500 animate-pulseSlow" />
          <span className="text-danger-400">120s DWELL LIMIT</span>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10" />

        {/* Live Clock */}
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-600" strokeWidth={1.8} />
          <LiveClock />
        </div>
      </div>
    </header>
  )
}
