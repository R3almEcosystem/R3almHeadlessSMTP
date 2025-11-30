// app/api/config/route.ts – V9.0 (OpenNext + Full Node.js Runtime – Works on Cloudflare Pages 2025)
// Version: 9.0
// Runtime: Node.js (via OpenNext) – full fs, path, nodemailer support

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
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
  // Default config if file missing
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

function saveConfig(config: Config) {
  mkdirSync(join(process.cwd(), 'data'), { recursive: true });
  writeFileSync(filePath, JSON.stringify(config, null, 2));
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