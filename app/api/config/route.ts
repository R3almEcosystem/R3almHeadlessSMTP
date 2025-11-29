// app/api/config/route.ts – Server-side only (safe for fs + nodemailer)
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
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
    adminPassword: 'r3alm-2025-change-me',
    smtp: { host: '', port: 587, secure: true, user: '', pass: '', fromEmail: '', fromName: 'R3alm' },
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