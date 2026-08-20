import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Auth is handled client-side via localStorage for Vercel static deployment
  return NextResponse.next();
}

export const config = { matcher: ['/(dashboard)/:path*'] };
