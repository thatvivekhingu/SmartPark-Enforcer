import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface GenerateChallanBody {
  plate: string;
  vehicle_type: string;
  dwell_minutes: number;
  zone: string;
  ocr_confidence: number;
  officer_id?: string;
  notes?: string;
  violation_type?: string;
}

export async function POST(request: NextRequest) {
  let body: GenerateChallanBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const {
    plate,
    vehicle_type,
    dwell_minutes,
    zone,
    ocr_confidence,
    officer_id = 'OFF-2024-001',
    notes = '',
    violation_type = 'Illegal Parking in No-Parking Zone',
  } = body;

  if (!plate || !vehicle_type || !zone) {
    return NextResponse.json(
      { error: 'Missing required fields: plate, vehicle_type, zone' },
      { status: 422 }
    );
  }

  // Try to call FastAPI backend if available
  const backendUrl = process.env.BACKEND_URL;
  if (backendUrl) {
    try {
      const response = await fetch(`${backendUrl}/api/v1/challans/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10_000),
      });
      if (response.ok) {
        return NextResponse.json(await response.json());
      }
    } catch {
      // Fall through to local generation
    }
  }

  // ── Generate challan locally ──────────────────────────────────────────────
  const issuedAt = new Date().toISOString();
  const challanNumber = `SPE-${Date.now().toString(36).toUpperCase()}`;
  const fine_amount = 500;

  // Tamper-evident hash of challan data
  const hashPayload = JSON.stringify({
    challan_number: challanNumber,
    plate,
    vehicle_type,
    dwell_minutes,
    zone,
    fine_amount,
    issued_at: issuedAt,
    officer_id,
    violation_type,
  });
  const sha256Hash = crypto.createHash('sha256').update(hashPayload).digest('hex');

  return NextResponse.json({
    challan_id: Math.floor(Math.random() * 9000) + 1000,
    challan_number: challanNumber,
    plate,
    vehicle_type,
    dwell_minutes,
    fine_amount,
    zone,
    officer_id,
    notes,
    violation_type,
    ocr_confidence,
    issued_at: issuedAt,
    sha256_hash: sha256Hash,
    verify_url: `https://smart-park-enforcer-khaki.vercel.app/verify/${challanNumber}`,
    status: 'issued',
  });
}
