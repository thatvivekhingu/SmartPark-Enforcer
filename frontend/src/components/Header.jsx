import React from 'react'
import { ShieldAlert, Camera, Cpu } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <div className="bg-red-600/20 p-2.5 rounded-lg border border-red-500/30 text-red-500">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-50 tracking-tight">SmartPark-Enforcer AI</h1>
          <p className="text-xs text-slate-400 font-medium">Automated No-Parking Geo-Fence & Digital Challan System</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700">
          <Camera className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">STREAM:</span>
          <span className="text-emerald-400 font-semibold">CAM-01 (ACTIVE)</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300">YOLO11 + ByteTrack:</span>
          <span className="text-cyan-400 font-semibold">RUNNING (CUDA/CPU)</span>
        </div>
        <div className="flex items-center gap-2 bg-red-950/60 text-red-400 px-3 py-1.5 rounded-md border border-red-800/50">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="font-semibold">DWELL LIMIT: 120s (2 MIN)</span>
        </div>
      </div>
    </header>
  )
}
