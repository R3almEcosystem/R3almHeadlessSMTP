// lib/smtp.ts
import { createClient } from '@vercel/kv';

// Replace with your actual KV URL and token from Vercel dashboard
const kv = createClient({
  url: process.env.KV_URL!,
  token: process.env.KV_TOKEN!,
});

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromEmail: string;
  fromName?: string;
}

// This is the magic line – satisfies Record<string, unknown>
type KVCompatibleConfig = SMTPConfig & Record<string, unknown>;

export async function getSMTPConfig(): Promise<SMTPConfig | null> {
  const data = await kv.hgetall<KVCompatibleConfig>('smtp_config');
  return data ?? null;
}

export async function saveSMTPConfig(config: SMTPConfig) {
  await kv.hset('smtp_config', config as Record<string, unknown>);
  return true;
}