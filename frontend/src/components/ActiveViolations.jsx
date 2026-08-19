import React from 'react'
import { AlertTriangle, Car, Bike, ArrowUpDown, CheckCheck, Clock, ExternalLink } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || ''

function DwellBar({ sec = 0, max = 120 }) {
  const pct = Math.min((sec / max) * 100, 100)
  const isOver = pct >= 100
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
      <div style={{ width: 48, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 2,
          width: `${pct}%`,
          background: isOver ? 'linear-gradient(90deg, #DC2626, #EF4444)' : 'linear-gradient(90deg, #D97706, #F59E0B)',
          boxShadow: isOver ? '0 0 6px #EF444460' : '0 0 6px #F59E0B40',
          transition: 'width 0.5s ease',
        }} />
      </div>
      <span className="font-mono" style={{
        fontSize: 11, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
        color: isOver ? '#F87171' : '#71717A',
        minWidth: 32, textAlign: 'right',
      }}>{sec}s</span>
    </div>
  )
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={6} style={{ padding: '36px 0', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Clock size={16} color="#3F3F46" strokeWidth={1.5} />
          </div>
          <div>
            <p style={{ fontSize: 12, color: '#52525B', fontWeight: 500 }}>No violations yet</p>
            <p style={{ fontSize: 10, color: '#27272A', marginTop: 3 }}>Violations appear when vehicles exceed the dwell threshold</p>
          </div>
        </div>
      </td>
    </tr>
  )
}

export default function ActiveViolations({ violations }) {
  return (
    <div className="card animate-fadeUp" style={{ animationDelay: '60ms' }}>
      <div className="card-header">
        <div className="card-title">
          <AlertTriangle size={13} color="#EF4444" strokeWidth={2.2} />
          Confirmed Violations
        </div>
        <span className={`pill ${violations.length > 0 ? 'pill-red' : 'pill-slate'}`}>
          {violations.length} TOTAL
        </span>
      </div>

      <div style={{ overflowX: 'auto', maxHeight: 300, overflowY: 'auto' }}>
        <table className="dtable" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <tr>
              <th style={{ width: 50 }}>#</th>
              <th>Type</th>
              <th>Plate</th>
              <th>Location</th>
              <th style={{ textAlign: 'right' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                  Dwell <ArrowUpDown size={8} color="#3F3F46" />
                </span>
              </th>
              <th>Time</th>
              <th>Status</th>
              <th style={{ width: 30 }}></th>
            </tr>
          </thead>
          <tbody>
            {violations.length === 0
              ? <EmptyState />
              : violations.map((v, i) => (
                <tr key={v.violation_id || i} style={{ animation: `slideIn 0.2s ease-out ${i * 50}ms both` }}>
                  <td>
                    <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: '#F59E0B' }}>
                      #{v.track_id}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      {v.vehicle_type === 'bike'
                        ? <Bike size={12} color="#52525B" strokeWidth={1.8} />
                        : <Car size={12} color="#52525B" strokeWidth={1.8} />
                      }
                      <span style={{ textTransform: 'capitalize', color: '#A1A1AA', fontSize: 12 }}>{v.vehicle_type || 'car'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono" style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                      padding: '2px 7px', borderRadius: 4,
                      background: v.vehicle_number && v.vehicle_number !== 'UNKNOWN' ? 'rgba(245,158,11,0.07)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${v.vehicle_number && v.vehicle_number !== 'UNKNOWN' ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)'}`,
                      color: v.vehicle_number && v.vehicle_number !== 'UNKNOWN' ? '#FBBF24' : '#52525B',
                    }}>
                      {v.vehicle_number && v.vehicle_number !== 'UNKNOWN' ? v.vehicle_number : 'UNKNOWN'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 11, color: '#52525B' }}>
                      {v.location ? v.location.substring(0, 20) : '--'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <DwellBar sec={Math.round(v.dwell_time || 0)} />
                  </td>
                  <td>
                    <span className="font-mono" style={{ fontSize: 10, color: '#3F3F46' }}>
                      {v.timestamp || '--'}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 3,
                      padding: '2px 7px', borderRadius: 99,
                      background: 'rgba(16,185,129,0.06)',
                      border: '1px solid rgba(16,185,129,0.15)',
                      fontSize: 9, fontWeight: 600, color: '#34D399',
                    }}>
                      <CheckCheck size={9} strokeWidth={2.5} />
                      {v.status || 'CONFIRMED'}
                    </span>
                  </td>
                  <td>
                    {v.sha256_hash && (
                      <a
                        href={`${API_BASE}/api/evidence/${v.violation_id}/verify`}
                        target="_blank" rel="noopener noreferrer"
                        title="Verify SHA-256"
                        style={{ color: '#3F3F46', textDecoration: 'none', transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#F59E0B'}
                        onMouseLeave={e => e.currentTarget.style.color = '#3F3F46'}
                      >
                        <ExternalLink size={11} strokeWidth={1.8} />
                      </a>
                    )}
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
