import React from 'react'
import { AlertTriangle, Car, Bike, ArrowUpDown, CheckCircle, ChevronsUpDown } from 'lucide-react'

function StatusPill({ status }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={{
        background: 'rgba(16,185,129,0.1)',
        border: '1px solid rgba(16,185,129,0.2)',
        color: '#34D399',
      }}
    >
      <CheckCircle className="w-3 h-3" strokeWidth={2} />
      Challan Issued
    </span>
  )
}

function DwellBar({ seconds, max = 120 }) {
  const pct = Math.min((seconds / max) * 100, 100)
  const isOver = pct >= 100
  return (
    <div className="flex items-center gap-2 justify-end">
      <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: isOver ? '#EF4444' : '#3B82F6',
          }}
        />
      </div>
      <span className="font-mono text-[12px] tabular-nums" style={{ color: isOver ? '#F87171' : '#94A3B8', minWidth: 38, textAlign: 'right' }}>
        {seconds}s
      </span>
    </div>
  )
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={6} className="py-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <AlertTriangle className="w-4 h-4 text-slate-600" strokeWidth={1.5} />
          </div>
          <p className="text-[13px] text-slate-600 font-medium">Monitoring active — no violations detected yet</p>
          <p className="text-[11px] text-slate-700">Vehicles in zone are tracked continuously</p>
        </div>
      </td>
    </tr>
  )
}

export default function ActiveViolations({ violations }) {
  return (
    <div className="card animate-fadeUp flex flex-col" style={{ animationDelay: '80ms' }}>
      <div className="card-header">
        <div className="card-title">
          <AlertTriangle className="w-4 h-4 text-danger-400" strokeWidth={1.8} />
          Confirmed Violations
        </div>
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}
          >
            {violations.length} TOTAL
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full data-table">
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
              <th>
                <div className="flex items-center gap-1">Track ID <ChevronsUpDown className="w-3 h-3 opacity-40" /></div>
              </th>
              <th>Vehicle</th>
              <th>Plate Number</th>
              <th className="text-right">
                <div className="flex items-center justify-end gap-1">Dwell <ArrowUpDown className="w-3 h-3 opacity-40" /></div>
              </th>
              <th>Timestamp</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {violations.length === 0 ? (
              <EmptyState />
            ) : (
              violations.map((v, i) => {
                const isVehicleCar = v.vehicle_type?.toLowerCase() === 'car'
                return (
                  <tr key={v.id || v.violation_id || i}>
                    {/* Track ID */}
                    <td>
                      <span className="font-mono text-[12px] font-semibold text-primary-400">#{v.track_id}</span>
                    </td>

                    {/* Vehicle type */}
                    <td>
                      <div className="flex items-center gap-1.5">
                        {isVehicleCar
                          ? <Car className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.5} />
                          : <Bike className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.5} />
                        }
                        <span className="capitalize text-slate-300">{v.vehicle_type || 'car'}</span>
                      </div>
                    </td>

                    {/* Plate */}
                    <td>
                      <span
                        className="font-mono text-[12px] font-semibold tracking-widest px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(252,211,77,0.08)', color: '#FCD34D', border: '1px solid rgba(252,211,77,0.15)' }}
                      >
                        {v.vehicle_number || 'UNKNOWN'}
                      </span>
                    </td>

                    {/* Dwell time with bar */}
                    <td className="text-right">
                      <DwellBar seconds={Math.round(v.dwell_time || 0)} />
                    </td>

                    {/* Timestamp */}
                    <td>
                      <span className="font-mono text-[11px] text-slate-500">{v.timestamp || '—'}</span>
                    </td>

                    {/* Status */}
                    <td>
                      <StatusPill status={v.status} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
