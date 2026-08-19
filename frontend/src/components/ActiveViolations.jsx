import React from 'react'
import { AlertTriangle, Car, Bike, ArrowUpDown, CheckCheck, Clock } from 'lucide-react'

function DwellBar({ sec = 0, max = 120 }) {
  const pct = Math.min((sec / max) * 100, 100)
  const isOver = pct >= 100
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
      <div style={{ width: 52, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 2,
          width: `${pct}%`,
          background: isOver
            ? 'linear-gradient(90deg, #DC2626, #FF4444)'
            : 'linear-gradient(90deg, #D97706, #F59E0B)',
          boxShadow: isOver ? '0 0 6px #FF444480' : '0 0 6px #F59E0B60',
          transition: 'width 0.5s ease',
        }} />
      </div>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 12, fontWeight: 600,
        color: isOver ? '#FF6B6B' : '#71717A',
        minWidth: 34, textAlign: 'right', tabularNums: true,
      }}>{sec}s</span>
    </div>
  )
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={6} style={{ padding: '40px 0', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Clock size={16} color="#3F3F46" strokeWidth={1.5} />
          </div>
          <div>
            <p style={{ fontSize: 13, color: '#52525B', fontWeight: 500, margin: 0 }}>No violations detected</p>
            <p style={{ fontSize: 11, color: '#3F3F46', margin: '3px 0 0' }}>Tracking all vehicles in geo-fence continuously</p>
          </div>
        </div>
      </td>
    </tr>
  )
}

export default function ActiveViolations({ violations }) {
  return (
    <div className="card animate-fadeUp" style={{ animationDelay: '70ms' }}>
      <div className="card-header">
        <div className="card-title">
          <AlertTriangle size={14} color="#FF6B6B" strokeWidth={2} />
          Confirmed Violations
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '3px 10px', borderRadius: 99,
          background: violations.length > 0 ? 'rgba(255,68,68,0.08)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${violations.length > 0 ? 'rgba(255,68,68,0.2)' : 'rgba(255,255,255,0.07)'}`,
        }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11, fontWeight: 700,
            color: violations.length > 0 ? '#FF6B6B' : '#52525B',
          }}>
            {violations.length} CONFIRMED
          </span>
        </div>
      </div>

      <div style={{ overflowX: 'auto', maxHeight: 280, overflowY: 'auto' }}>
        <table className="dtable" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <tr>
              <th>ID</th>
              <th>Vehicle</th>
              <th>Plate</th>
              <th style={{ textAlign: 'right' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                  Dwell <ArrowUpDown size={9} color="#3F3F46" />
                </span>
              </th>
              <th>Timestamp</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {violations.length === 0
              ? <EmptyState />
              : violations.map((v, i) => (
                <tr key={v.id || i}>
                  {/* Track ID */}
                  <td>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 12, fontWeight: 700,
                      color: '#F59E0B',
                    }}>#{v.track_id}</span>
                  </td>

                  {/* Type */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {v.vehicle_type === 'bike'
                        ? <Bike size={13} color="#52525B" strokeWidth={1.5} />
                        : <Car  size={13} color="#52525B" strokeWidth={1.5} />
                      }
                      <span style={{ textTransform: 'capitalize', color: '#A1A1AA' }}>{v.vehicle_type || 'car'}</span>
                    </div>
                  </td>

                  {/* Plate */}
                  <td>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
                      padding: '2px 8px', borderRadius: 4,
                      background: 'rgba(245,158,11,0.08)',
                      border: '1px solid rgba(245,158,11,0.18)',
                      color: '#FBBF24',
                    }}>
                      {v.vehicle_number || 'UNKNOWN'}
                    </span>
                  </td>

                  {/* Dwell bar */}
                  <td style={{ textAlign: 'right' }}>
                    <DwellBar sec={Math.round(v.dwell_time || 0)} />
                  </td>

                  {/* Timestamp */}
                  <td>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#52525B' }}>
                      {v.timestamp || '—'}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '2px 8px', borderRadius: 99,
                      background: 'rgba(16,185,129,0.08)',
                      border: '1px solid rgba(16,185,129,0.2)',
                      fontSize: 10, fontWeight: 600, color: '#34D399',
                    }}>
                      <CheckCheck size={10} strokeWidth={2.5} />
                      Issued
                    </span>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
