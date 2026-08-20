'use client';

import { useRouter } from 'next/navigation';
import {
  Car,
  AlertTriangle,
  FileText,
  Cpu,
} from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import StatusPill from '@/components/shared/StatusPill';

interface ActiveViolation {
  id: number;
  plate: string;
  zone: string;
  dwell: string;
  status: string;
}

interface RecentChallan {
  id: number;
  number: string;
  plate: string;
  type: string;
  amount: number;
  time: string;
  status: string;
}

const activeViolations: ActiveViolation[] = [
  { id: 1, plate: 'NL01C7821', zone: 'Street No-Parking Curb, Nagaland', dwell: '05:12', status: 'CONFIRMED' },
  { id: 2, plate: 'MH12AB3456', zone: 'Junction Gate No-Stop Zone', dwell: '03:47', status: 'PENDING' },
  { id: 3, plate: 'DL4CAF7789', zone: 'Market Road Restricted Area', dwell: '07:05', status: 'CONFIRMED' },
];

const recentChallans: RecentChallan[] = [
  { id: 1, number: 'CH-2026-0001', plate: 'NL01C7821',  type: 'Car',         amount: 500, time: '09:02 AM', status: 'ISSUED' },
  { id: 2, number: 'CH-2026-0002', plate: 'MH12AB3456', type: 'Motorcycle',  amount: 300, time: '08:45 AM', status: 'PAID'   },
  { id: 3, number: 'CH-2026-0003', plate: 'DL4CAF7789', type: 'Car',         amount: 500, time: '08:21 AM', status: 'ISSUED' },
  { id: 4, number: 'CH-2026-0004', plate: 'KA03MN2211', type: 'Truck',       amount: 800, time: '07:55 AM', status: 'DISPUTED'},
  { id: 5, number: 'CH-2026-0005', plate: 'TN09XY4512', type: 'Car',         amount: 500, time: '07:30 AM', status: 'PAID'   },
];

export default function OverviewPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <PageHeader title="Command Center" breadcrumbs={[{ label: 'Overview' }]} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Vehicles" value={105} icon={Car} />
        <StatCard label="Active Violations" value={3} icon={AlertTriangle} accent />
        <StatCard label="Challans Issued" value={15} icon={FileText} />
        <div className="rounded-[10px] border bg-[#12151B] p-5 shadow-card transition-colors hover:bg-[#191D25]"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="h-4 w-4 text-[#5B6070]" strokeWidth={1.5} />
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#5B6070]">OCR Accuracy</span>
          </div>
          <div className="text-[28px] font-semibold tracking-tight leading-none text-[#EDEEF1]">96.2%</div>
        </div>
      </div>

      {/* Main two-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Live feed — 3/5 */}
        <div
          className="lg:col-span-3 rounded-xl border bg-[#12151B] overflow-hidden"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-sm font-medium text-[#EDEEF1]">Live AI Detection Feed</span>
            </div>
            <span className="text-xs text-[#5B6070] font-mono">CAM-01 · Nagaland Street</span>
          </div>
          <div className="relative bg-black aspect-video">
            <video
              src="/videos/annotated_output.mp4"
              autoPlay
              loop
              muted
              playsInline
              controls
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Active violations — 2/5 */}
        <div
          className="lg:col-span-2 rounded-xl border bg-[#12151B]"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <span className="text-sm font-medium text-[#EDEEF1]">Active Violations</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#EF4444' }}
            >
              {activeViolations.length} live
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            {activeViolations.map((v) => (
              <button
                key={v.id}
                onClick={() => router.push(`/violations/${v.id}`)}
                className="w-full text-left px-4 py-3.5 hover:bg-[#191D25] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-mono text-sm font-semibold text-[#F59E0B]">{v.plate}</div>
                    <div className="text-xs text-[#9096A3] mt-0.5 leading-snug">{v.zone}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <StatusPill status={v.status} />
                    <div className="text-xs font-mono text-[#5B6070] mt-1">{v.dwell}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent challans table */}
      <div
        className="rounded-xl border bg-[#12151B] overflow-hidden"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <span className="text-sm font-medium text-[#EDEEF1]">Recent Challans</span>
          <button
            onClick={() => router.push('/challans')}
            className="text-xs text-[#4C6FFF] hover:underline"
          >
            View all →
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Challan No.', 'Plate', 'Type', 'Fine', 'Time', 'Status'].map((h) => (
                <th key={h} className="px-5 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-[#5B6070]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentChallans.map((c, i) => (
              <tr
                key={c.id}
                onClick={() => router.push(`/challans/${c.id}`)}
                className="cursor-pointer hover:bg-[#191D25] transition-colors"
                style={i < recentChallans.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.05)' } : {}}
              >
                <td className="px-5 py-3 font-mono text-xs text-[#9096A3]">{c.number}</td>
                <td className="px-5 py-3 font-mono text-sm font-semibold text-[#F59E0B]">{c.plate}</td>
                <td className="px-5 py-3 text-[#9096A3]">{c.type}</td>
                <td className="px-5 py-3 font-semibold text-[#EDEEF1]">₹{c.amount}</td>
                <td className="px-5 py-3 text-xs text-[#5B6070] font-mono">{c.time}</td>
                <td className="px-5 py-3"><StatusPill status={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
