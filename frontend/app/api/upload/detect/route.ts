import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Parse multipart form data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Failed to parse form data' }, { status: 400 });
  }

  const image = formData.get('image') as File | null;
  const dwellRaw = formData.get('dwell_minutes');
  const dwellMinutes = dwellRaw ? parseInt(dwellRaw as string, 10) : 0;

  if (!image) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  if (!image.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Uploaded file is not an image' }, { status: 422 });
  }

  // Try to call FastAPI backend if available
  const backendUrl = process.env.BACKEND_URL;
  if (backendUrl) {
    try {
      const upstream = new FormData();
      upstream.append('image', image);
      upstream.append('dwell_minutes', String(dwellMinutes));
      const response = await fetch(`${backendUrl}/api/v1/upload/detect`, {
        method: 'POST',
        body: upstream,
        signal: AbortSignal.timeout(15_000),
      });
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch {
      // Fall through to mock detection
    }
  }

  // ── Mock detection result ─────────────────────────────────────────────────
  // Simulate realistic Indian vehicle plates
  const plates = ['NL01C7821', 'MH02AB0018', 'DL03CD4521', 'KA04EF6789', 'TN05GH3210'];
  const plate = plates[Math.floor(Math.random() * plates.length)];
  const confidence = Math.round((0.85 + Math.random() * 0.13) * 100) / 100;
  const vehicleTypes = ['car', 'motorcycle', 'truck'] as const;
  const vehicle_type = vehicleTypes[0]; // defaulting to car for demo

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json({
    plate,
    confidence,
    vehicle_type,
    dwell_minutes: isNaN(dwellMinutes) ? 30 : dwellMinutes,
    bbox: [120, 80, 420, 300],
    source: 'mock',
  });
}
