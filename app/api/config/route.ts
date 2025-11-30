// app/api/config/route.ts – V11.0 (Edge Runtime + Polyfills for Cloudflare Pages)
// Version: 11.0
// Bundles with next-on-pages – fs polyfill with Fetch for config.json

export const runtime = 'edge';  // Required for Cloudflare Pages API routes

import { NextRequest } from 'next/server';

// Polyfill for fs.readFileSync (Edge Runtime has no fs)
async function readConfig(): Promise<any> {
  try {
    const response = await fetch('/config.json');  // Assume config.json in public/
    if (!response.ok) throw new Error('Config not found');
    return await response.json();
  } catch {
    // Default config if missing
    return {
      adminPassword: 'Z3us!@#$1',
      smtp: {
        host: 'mail.r3alm.com',
        port: 587,
        secure: false,
        user: 'no-reply@r3alm.com',
        pass: 'Z3us!@#$1r3alm',
        fromEmail: 'no-reply@r3alm.com',
        fromName: 'R3alm Ecosystem'
      }
    };
  }
}

interface Config {
  adminPassword: string;
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    fromEmail: string;
    fromName?: string;
  };
}

function getConfig(): Config {
  return readConfig();
}

function saveConfig(config: Config) {
  // Edge Runtime can't write files – use dashboard env vars for production
  console.log('Save config:', config);  // Log for dashboard
}

export async function GET() {
  return Response.json(getConfig());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    saveConfig(body);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}