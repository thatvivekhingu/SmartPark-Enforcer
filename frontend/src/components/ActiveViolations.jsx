import React from 'react'
import { AlertTriangle, Car, Clock, ShieldAlert } from 'lucide-react'

export default function ActiveViolations({ violations }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">CONFIRMED VIOLATIONS</h2>
        </div>
        <span className="text-xs font-mono bg-red-950/80 text-red-400 px-2.5 py-1 rounded border border-red-800/60 font-semibold">
          TOTAL: {violations.length}
        </span>
      </div>

      <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] sticky top-0">
            <tr>
              <th className="px-3 py-2">Track ID</th>
              <th className="px-3 py-2">Vehicle</th>
              <th className="px-3 py-2">Plate Number</th>
              <th className="px-3 py-2">Dwell Time</th>
              <th className="px-3 py-2">Violation Time</th>
              <th className="px-3 py-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {violations.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-slate-500 italic font-sans">
                  No confirmed violations detected. Vehicles in zone are monitored continuously.
                </td>
              </tr>
            ) : (
              violations.map((v) => (
                <tr key={v.id || v.violation_id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-3 py-2.5 text-cyan-400 font-semibold">#{v.track_id}</td>
                  <td className="px-3 py-2.5 flex items-center gap-1.5 capitalize">
                    <Car className="w-3.5 h-3.5 text-slate-400" />
                    {v.vehicle_type}
                  </td>
                  <td className="px-3 py-2.5 font-bold text-yellow-400 tracking-wider">
                    {v.vehicle_number || "UNKNOWN"}
                  </td>
                  <td className="px-3 py-2.5 text-red-400 font-semibold">
                    {Math.round(v.dwell_time)}s / 120s
                  </td>
                  <td className="px-3 py-2.5 text-slate-400">{v.timestamp}</td>
                  <td className="px-3 py-2.5 text-right">
                    <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] border border-red-500/30 font-semibold">
                      CHALLAN GENERATED
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
