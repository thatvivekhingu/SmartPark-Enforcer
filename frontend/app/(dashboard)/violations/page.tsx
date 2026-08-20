'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import StatusPill from '@/components/shared/StatusPill';

interface Violation {
  id: number;
  thumbnail: string;
  plate: string;
  vehicleType: string;
  zone: string;
  dwellTime: string;
  timestamp: string;
  status: string;
}

const VIOLATIONS: Violation[] = [
  {
    id: 1,
    thumbnail: '/evidence/violations/violation_parking_cctv_1_tr18_20260819_184602.jpg',
    plate: 'NL01C7821',
    vehicleType: 'Car',
    zone: 'Street No-Parking Curb, Nagaland',
    dwellTime: '05:12',
    timestamp: '20 Aug 2026, 09:02:15',
    status: 'CONFIRMED',
  },
  {
    id: 2,
    thumbnail: '/evidence/violations/violation_parking_cctv_1_tr23_20260819_184606.jpg',
    plate: 'MH12AB3456',
    vehicleType: 'Motorcycle',
    zone: 'Junction Gate No-Stop Zone',
    dwellTime: '03:47',
    timestamp: '20 Aug 2026, 08:45:33',
    status: 'PENDING',
  },
  {
    id: 3,
    thumbnail: '/evidence/violations/violation_parking_cctv_1_tr26_20260819_184610.jpg',
    plate: 'DL4CAF7789',
    vehicleType: 'Car',
    zone: 'Market Road Restricted Area',
    dwellTime: '07:05',
    timestamp: '20 Aug 2026, 08:21:07',
    status: 'CONFIRMED',
  },
  {
    id: 4,
    thumbnail: '/evidence/violations/violation_parking_cctv_1_tr27_20260819_184616.jpg',
    plate: 'KA03MN2211',
    vehicleType: 'Truck',
    zone: 'Bus Stand No-Parking Zone',
    dwellTime: '12:30',
    timestamp: '20 Aug 2026, 07:55:42',
    status: 'CONFIRMED',
  },
  {
    id: 5,
    thumbnail: '/evidence/violations/violation_parking_cctv_1_tr28_20260819_184626.jpg',
    plate: 'TN09XY4512',
    vehicleType: 'Car',
    zone: 'Street No-Parking Curb, Nagaland',
    dwellTime: '06:15',
    timestamp: '20 Aug 2026, 07:30:19',
    status: 'DISMISSED',
  },
  {
    id: 6,
    thumbnail: '/evidence/violations/violation_youtube_test_tr157_20260819_184839.jpg',
    plate: 'GJ01AA1234',
    vehicleType: 'Car',
    zone: 'Junction Gate No-Stop Zone',
    dwellTime: '08:22',
    timestamp: '19 Aug 2026, 18:48:39',
    status: 'CONFIRMED',
  },
  {
    id: 7,
    thumbnail: '/evidence/violations/violation_youtube_test_tr161_20260819_184841.jpg',
    plate: 'UP32CK5678',
    vehicleType: 'Bus',
    zone: 'Bus Stand No-Parking Zone',
    dwellTime: '15:00',
    timestamp: '19 Aug 2026, 18:48:41',
    status: 'PENDING',
  },
  {
    id: 8,
    thumbnail: '/evidence/violations/violation_youtube_test_tr164_20260819_184843.jpg',
    plate: 'RJ14GB9900',
    vehicleType: 'Car',
    zone: 'Market Road Restricted Area',
    dwellTime: '09:48',
    timestamp: '19 Aug 2026, 18:48:43',
    status: 'CONFIRMED',
  },
];

const STATUS_FILTERS = ['All', 'CONFIRMED', 'PENDING', 'DISMISSED'] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const VEHICLE_TYPES = ['All Types', 'Car', 'Motorcycle', 'Truck', 'Bus'] as const;

function exportCSV(data: Violation[]) {
  const header = 'ID,Plate,Type,Zone,Dwell,Timestamp,Status\n';
  const rows = data.map(
    (v) => `${v.id},${v.plate},${v.vehicleType},"${v.zone}",${v.dwellTime},"${v.timestamp}",${v.status}`
  );
  const blob = new Blob([header + rows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'violations.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function ViolationsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [vehicleFilter, setVehicleFilter] = useState('All Types');

  const filtered = VIOLATIONS.filter((v) => {
    const matchStatus = statusFilter === 'All' || v.status === statusFilter;
    const matchType = vehicleFilter === 'All Types' || v.vehicleType === vehicleFilter;
    return matchStatus && matchType;
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Violations"
        breadcrumbs={[{ label: 'Violations' }]}
        actions={
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium text-[#9096A3] hover:text-[#EDEEF1] hover:border-[#4C6FFF]/50 transition-all"
            style={{ borderColor: 'rgba(255,255,255,0.12)', backgroundColor: '#191D25' }}
          >
            <Download className="h-4 w-4" strokeWidth={1.5} />
            Export CSV
          </button>
        }
      />

      {/* Filter bar */}
      <div
        className="sticky top-0 z-10 flex flex-wrap items-center gap-3 p-3 rounded-xl border bg-[#12151B] backdrop-blur"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-1.5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: statusFilter === s ? 'rgba(76,111,255,0.15)' : 'transparent',
                color: statusFilter === s ? '#4C6FFF' : '#9096A3',
                border: statusFilter === s ? '1px solid rgba(76,111,255,0.3)' : '1px solid transparent',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div
          className="h-5 w-px"
          style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
        />

        <select
          value={vehicleFilter}
          onChange={(e) => setVehicleFilter(e.target.value)}
          className="px-3 py-1 rounded-lg text-xs text-[#9096A3] outline-none cursor-pointer"
          style={{
            backgroundColor: '#191D25',
            border: '1px solid rgba(255,255,255,0.07)',
            color: '#9096A3',
          }}
        >
          {VEHICLE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <span className="ml-auto text-xs text-[#5B6070]">
          Showing {filtered.length} of {VIOLATIONS.length}
        </span>
      </div>

      {/* Table */}
      <div
        className="rounded-xl border bg-[#12151B] overflow-hidden"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['', 'Plate', 'Type', 'Zone', 'Dwell', 'Timestamp', 'Status', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-[#5B6070]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-[#5B6070]">
                  No violations match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((v, i) => (
                <tr
                  key={v.id}
                  onClick={() => router.push(`/violations/${v.id}`)}
                  className="cursor-pointer hover:bg-[#191D25] transition-colors"
                  style={i < filtered.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.05)' } : {}}
                >
                  {/* Thumbnail */}
                  <td className="px-4 py-2.5">
                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-[#191D25] shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={v.thumbnail}
                        alt={v.plate}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-mono font-semibold text-[#F59E0B]">{v.plate}</td>
                  <td className="px-4 py-2.5 text-[#9096A3]">{v.vehicleType}</td>
                  <td className="px-4 py-2.5 text-xs text-[#9096A3] max-w-[180px] truncate">{v.zone}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-[#EDEEF1]">{v.dwellTime}</td>
                  <td className="px-4 py-2.5 text-xs text-[#5B6070] whitespace-nowrap">{v.timestamp}</td>
                  <td className="px-4 py-2.5"><StatusPill status={v.status} /></td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/violations/${v.id}`);
                      }}
                      className="px-3 py-1 rounded-lg text-xs font-medium text-[#4C6FFF] border transition-all hover:bg-[#4C6FFF]/10"
                      style={{ border: '1px solid rgba(76,111,255,0.3)' }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination footer */}
        <div
          className="flex items-center justify-between px-5 py-3 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <span className="text-xs text-[#5B6070]">
            1–{filtered.length} of {filtered.length} violations
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled
              className="p-1.5 rounded-lg text-[#5B6070] opacity-40 cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 rounded-lg text-xs bg-[#4C6FFF]/15 text-[#4C6FFF] font-medium">1</span>
            <button
              disabled
              className="p-1.5 rounded-lg text-[#5B6070] opacity-40 cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
