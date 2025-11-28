import { NextRequest } from 'next/server';
import { saveSMTPConfig, getSMTPConfig } from '@/lib/smtp';

export const runtime = 'edge';

// Simple auth (replace with better later)
const AUTH_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me-123';

function checkAuth(req: NextRequest) {
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${AUTH_PASSWORD}`;
}

export async function GET() {
  if (!checkAuth(request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const config = await getSMTPConfig();
  return new Response(JSON.stringify(config || {}), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const config = await req.json();
  await saveSMTPConfig(config);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}