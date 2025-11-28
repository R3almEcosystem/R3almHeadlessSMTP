// app/api/settings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { saveSMTPConfig, getSMTPConfig } from '@/lib/smtp';

const AUTH_PASSWORD = process.env.ADMIN_PASSWORD ?? 'change-me-123';

// Simple Bearer token auth (you can upgrade to JWT later if needed)
function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization');
  if (!auth) return false;
  return auth === `Bearer ${AUTH_PASSWORD}`;
}

// GET /api/settings → return current SMTP config
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const config = await getSMTPConfig();
    return NextResponse.json(config || {});
  } catch (error) {
    console.error('Failed to read SMTP config:', error);
    return NextResponse.json(
      { error: 'Failed to load config' },
      { status: 500 }
    );
  }
}

// POST /api/settings → save new SMTP config
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const config = await req.json();
    await saveSMTPConfig(config);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save SMTP config:', error);
    return NextResponse.json(
      { error: 'Invalid JSON or save failed' },
      { status: 400 }
    );
  }
}

// Optional: Block other methods
export const dynamic = 'force-dynamic'; // if you're reading/writing files at request time