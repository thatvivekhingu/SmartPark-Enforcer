import React from 'react'
import { Video, Shield } from 'lucide-react'

export default function LiveFeed() {
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

      {/* Video Feed Frame */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center group">
        <img
          src="/api/stream"
          alt="Live Enforcement Feed"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 800 450'><rect width='800' height='450' fill='%230f172a'/><text x='50%' y='45%' font-family='sans-serif' font-size='20' fill='%23ef4444' text-anchor='middle'>LIVE STREAM INITIALIZING...</text><text x='50%' y='55%' font-family='sans-serif' font-size='14' fill='%2364748b' text-anchor='middle'>Connect backend at http://localhost:8000</text></svg>";
          }}
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 bg-red-600/90 text-white font-mono text-xs px-2.5 py-1 rounded shadow flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          LIVE ENFORCEMENT
        </div>

        <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-700 text-slate-300 font-mono text-xs px-3 py-1.5 rounded flex items-center gap-2 backdrop-blur-sm">
          <Shield className="w-3.5 h-3.5 text-yellow-400" />
          <span>No-Parking Zone 1 (120s Rule)</span>
        </div>
      </div>
    </div>
  )
}
