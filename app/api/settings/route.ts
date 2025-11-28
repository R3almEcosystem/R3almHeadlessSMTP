// app/api/settings/route.ts
import { NextRequest } from 'next/server';
import { saveSMTPConfig, getSMTPConfig } from '@/lib/smtp';

// REMOVE THIS LINE — nodemailer + @vercel/kv don't work on Edge
// export const runtime = 'edge';

// Secure password — always use env var in production!
const AUTH_PASSWORD = process.env.ADMIN_PASSWORD ?? 'change-me-123';

// Fixed: `request` was undefined → use the actual `req` parameter
function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${AUTH_PASSWORD}`;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Bearer' },
    });
  }

  try {
    const config = await getSMTPConfig();
    return new Response(JSON.stringify(config || {}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch config' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Bearer' },
    });
  }

  try {
    const config = await req.json();
    await saveSMTPConfig(config);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to save config' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Optional: nice health check
export async function OPTIONS() {
  return new Response(null, { status: 204 });
}