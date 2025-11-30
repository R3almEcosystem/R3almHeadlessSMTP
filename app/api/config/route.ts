// app/api/config/route.ts – V8.0 (Edge Runtime for Cloudflare Pages)
export const runtime = 'edge';  // ← THIS IS THE MAGIC LINE

import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { NextRequest } from 'next/server';

const filePath = join(process.cwd(), 'data', 'config.json');

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
  if (existsSync(filePath)) {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  }
  return {
    adminPassword: 'Z3us!@#$1',
    smtp: { host: 'mail.r3alm.com', port: 587, secure: false, user: 'no-reply@r3alm.com', pass: 'Z3us!@#$1r3alm', fromEmail: 'no-reply@r3alm.com', fromName: 'R3alm Ecosystem' },
  };
}

function saveConfig(config: Config) {
  mkdirSync(join(process.cwd(), 'data'), { recursive: true });
  writeFileSync(filePath, JSON.stringify(config, null, 2));
}

export async function GET() {
  return Response.json(getConfig());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  saveConfig(body);
  return Response.json({ success: true });
}