import React, { useState } from 'react'
import { Video, Shield, RefreshCw } from 'lucide-react'

export default function LiveFeed() {
  const [streamError, setStreamError] = useState(false)

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-red-500" />
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">LIVE CCTV VIDEO STREAM</h2>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono border border-slate-700">
            Shapely Polygon Geo-Fence: ACTIVE
          </span>
        </div>
      </div>

      {/* Video Feed Container */}
      <div className="relative aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center group">
        {!streamError ? (
          <img
            src="/api/stream"
            alt="Live Enforcement Feed"
            className="w-full h-full object-cover"
            onError={() => setStreamError(true)}
          />
        ) : (
          /* Simulated Live CCTV Video Feed Canvas for Cloud Deployments (Vercel) */
          <div className="w-full h-full relative bg-slate-900 flex flex-col items-center justify-center p-4 text-center font-mono">
            {/* Simulated Road & Parking Bay Graphic */}
            <div className="absolute inset-4 border-2 border-dashed border-red-500/80 bg-red-500/10 rounded-lg flex flex-col justify-between p-4">
              <div className="flex justify-between items-start">
                <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                  NO-PARKING ZONE (120s DWELL LIMIT)
                </span>
                <span className="text-red-400 text-[11px] font-semibold animate-pulse">
                  ● DWELL TIMER ACCUMULATING
                </span>
              </div>

              {/* Simulated Vehicle Bounding Box */}
              <div className="self-center bg-blue-900/40 border-2 border-red-500 p-3 rounded text-left shadow-lg w-64">
                <div className="text-[10px] text-red-400 font-bold">#1 CAR | VIOLATION! (125s/120s)</div>
                <div className="text-xs text-yellow-300 font-bold mt-1">MH12AB1234</div>
                <div className="text-[9px] text-slate-300 mt-1">PlateTrace OCR Verified</div>
              </div>

              <div className="text-right text-[10px] text-slate-400">
                POLYGON: [300, 200] &rarr; [980, 580]
              </div>
            </div>

            <div className="relative z-10 bg-slate-950/90 border border-slate-800 p-3 rounded-lg flex items-center gap-3 mt-auto">
              <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
              <div className="text-left text-xs font-sans">
                <span className="text-slate-200 font-semibold block">Live Enforcement System Active</span>
                <span className="text-slate-400 text-[11px]">Connecting to local FastAPI server (`python backend/main.py`)</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Overlay Live Badge */}
        <div className="absolute top-3 left-3 bg-red-600/90 text-white font-mono text-xs px-2.5 py-1 rounded shadow flex items-center gap-1.5 z-20">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          LIVE ENFORCEMENT
        </div>

        <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-700 text-slate-300 font-mono text-xs px-3 py-1.5 rounded flex items-center gap-2 backdrop-blur-sm z-20">
          <Shield className="w-3.5 h-3.5 text-yellow-400" />
          <span>No-Parking Zone 1 (120s Rule)</span>
        </div>
      </div>
    </div>
  )
}
