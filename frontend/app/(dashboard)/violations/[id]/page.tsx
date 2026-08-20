'use client';

import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Copy, Check, Save } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import StatusPill from '@/components/shared/StatusPill';

interface ViolationDetail {
  id: number;
  plate: string;
  vehicleType: string;
  zone: string;
  dwellTime: string;
  timestamp: string;
  status: string;
  ocrConfidence: number;
  sha256: string;
  image: string;
  plateImage: string;
}

const VIOLATIONS_MAP: Record<number, ViolationDetail> = {
  1: {
    id: 1,
    plate: 'NL01C7821',
    vehicleType: 'Car',
    zone: 'Street No-Parking Curb, Nagaland',
    dwellTime: '05:12 (exceeded 05:00 limit)',
    timestamp: '20 Aug 2026, 09:02:15',
    status: 'CONFIRMED',
    ocrConfidence: 94.7,
    sha256: 'a3f8d2c1e9b4726f0d5e8a3c1b2f9e7d4c6a1b8e3d5f2c9a7b4e1d8c6f3a2b1',
    image: '/evidence/violations/violation_parking_cctv_1_tr18_20260819_184602.jpg',
    plateImage: '/evidence/plates/plate_parking_cctv_1_tr18_20260819_184602.jpg',
  },
  2: {
    id: 2,
    plate: 'MH12AB3456',
    vehicleType: 'Motorcycle',
    zone: 'Junction Gate No-Stop Zone',
    dwellTime: '03:47 (exceeded 03:00 limit)',
    timestamp: '20 Aug 2026, 08:45:33',
    status: 'PENDING',
    ocrConfidence: 88.2,
    sha256: 'b9c3e7f1a4d8b2e6c0f4a8d2e6f0b4c8a2d6e0f4b8c2a6d0f4e8b2c6a0d4e8',
    image: '/evidence/violations/violation_parking_cctv_1_tr23_20260819_184606.jpg',
    plateImage: '/evidence/plates/plate_parking_cctv_1_tr23_20260819_184606.jpg',
  },
};

function getViolation(id: number): ViolationDetail {
  return (
    VIOLATIONS_MAP[id] ?? {
      id,
      plate: `XX00YY${id}000`,
      vehicleType: 'Car',
      zone: 'Market Road Restricted Area',
      dwellTime: '06:30 (exceeded 05:00 limit)',
      timestamp: '19 Aug 2026, 18:48:00',
      status: 'CONFIRMED',
      ocrConfidence: 91.5,
      sha256: 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
      image: '/evidence/violations/violation_youtube_test_tr157_20260819_184839.jpg',
      plateImage: '/evidence/plates/plate_youtube_test_tr157_20260819_184839.jpg',
    }
  );
}

export default function ViolationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id ?? '1', 10);
  const v = getViolation(id);

  const [copied, setCopied] = useState(false);
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  const copyHash = useCallback(() => {
    navigator.clipboard.writeText(v.sha256).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [v.sha256]);

  const saveNotes = () => {
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const shortHash = `${v.sha256.slice(0, 12)}...${v.sha256.slice(-8)}`;

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Violation #${v.id}`}
        breadcrumbs={[
          { label: 'Violations', href: '/violations' },
          { label: `#${v.id}` },
        ]}
        actions={
          <button
            onClick={() => router.push('/violations')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm text-[#9096A3] hover:text-[#EDEEF1] transition-all"
            style={{ borderColor: 'rgba(255,255,255,0.12)', backgroundColor: '#191D25' }}
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Back
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* LEFT: Evidence images */}
        <div className="space-y-4">
          <div
            className="rounded-xl border overflow-hidden bg-[#12151B]"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <div className="px-4 py-3 border-b text-sm font-medium text-[#EDEEF1]" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              Evidence Image
            </div>
            <div className="aspect-video bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={v.image}
                alt="Evidence"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div
            className="rounded-xl border overflow-hidden bg-[#12151B]"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <div className="px-4 py-3 border-b text-sm font-medium text-[#EDEEF1]" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              License Plate Crop (OCR)
            </div>
            <div className="flex items-center justify-center p-4 bg-black min-h-[80px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={v.plateImage}
                alt="Plate crop"
                className="max-h-24 object-contain rounded"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Details */}
        <div className="space-y-4">
          <div
            className="rounded-xl border bg-[#12151B]"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <div className="px-4 py-3 border-b text-sm font-medium text-[#EDEEF1]" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              Violation Details
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {/* Plate */}
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-xs text-[#9096A3] uppercase tracking-wider">Plate Number</span>
                <span className="font-mono text-xl font-bold text-[#F59E0B]">{v.plate}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-xs text-[#9096A3] uppercase tracking-wider">Vehicle Type</span>
                <span className="text-sm text-[#EDEEF1]">{v.vehicleType}</span>
              </div>
              <div className="flex items-start justify-between px-5 py-3">
                <span className="text-xs text-[#9096A3] uppercase tracking-wider">Zone</span>
                <span className="text-sm text-[#EDEEF1] text-right max-w-[220px]">{v.zone}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-xs text-[#9096A3] uppercase tracking-wider">Dwell Time</span>
                <span className="font-mono text-sm text-[#EF4444]">{v.dwellTime}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-xs text-[#9096A3] uppercase tracking-wider">Timestamp</span>
                <span className="text-sm text-[#EDEEF1]">{v.timestamp}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-xs text-[#9096A3] uppercase tracking-wider">Status</span>
                <StatusPill status={v.status} />
              </div>

              {/* OCR Confidence */}
              <div className="px-5 py-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#9096A3] uppercase tracking-wider">OCR Confidence</span>
                  <span className="text-sm font-semibold text-[#EDEEF1]">{v.ocrConfidence}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#191D25] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${v.ocrConfidence}%`,
                      backgroundColor: v.ocrConfidence > 90 ? '#22C55E' : v.ocrConfidence > 75 ? '#F59E0B' : '#EF4444',
                    }}
                  />
                </div>
              </div>

              {/* SHA-256 */}
              <div className="px-5 py-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#9096A3] uppercase tracking-wider">SHA-256 Hash</span>
                  <button
                    onClick={copyHash}
                    className="flex items-center gap-1.5 text-xs text-[#4C6FFF] hover:underline"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <code className="block w-full text-[11px] font-mono text-[#5B6070] break-all">
                  {shortHash}
                </code>
              </div>
            </div>
          </div>

          {/* Officer Notes */}
          <div
            className="rounded-xl border bg-[#12151B]"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <div className="px-4 py-3 border-b text-sm font-medium text-[#EDEEF1]" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              Officer Notes
            </div>
            <div className="p-4 space-y-3">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add observations, context, or follow-up actions…"
                rows={4}
                className="w-full rounded-lg border bg-[#191D25] px-3 py-2.5 text-sm text-[#EDEEF1] placeholder:text-[#5B6070] outline-none focus:border-[#4C6FFF]/60 resize-none transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.07)' }}
              />
              <button
                onClick={saveNotes}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4C6FFF] text-white text-sm font-medium hover:bg-[#3d5ce6] transition-all"
              >
                <Save className="h-4 w-4" strokeWidth={1.5} />
                {notesSaved ? 'Saved!' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
