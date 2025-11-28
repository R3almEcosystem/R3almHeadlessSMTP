import { NextRequest, NextResponse } from 'next/server';
import { saveSMTPConfig, getSMTPConfig } from '@/lib/smtp';

const AUTH_PASSWORD = process.env.ADMIN_PASSWORD ?? 'change-me-immediately';

function checkAuth(req: NextRequest) {
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${AUTH_PASSWORD}`;
}

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return new NextResponse('Unauthorized', { status: 401 });
  const config = await getSMTPConfig();
  return NextResponse.json(config || {});
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return new NextResponse('Unauthorized', { status: 401 });
  const body = await req.json();
  await saveSMTPConfig(body);
  return NextResponse.json({ success: true });
}