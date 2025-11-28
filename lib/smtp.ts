// lib/smtp.ts
import { createClient } from '@vercel/kv';
import nodemailer from 'nodemailer';

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

// Make KV happy with types
type KVConfig = SMTPConfig & Record<string, unknown>;

export async function getSMTPConfig(): Promise<SMTPConfig | null> {
  const data = await kv.hgetall<KVConfig>('smtp_config');
  return data ?? null;
}

export async function saveSMTPConfig(config: SMTPConfig) {
  await kv.hset('smtp_config', config as Record<string, unknown>);
}

// THE MISSING FUNCTION – THIS IS WHAT WAS BREAKING THE BUILD
export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  const config = await getSMTPConfig();
  if (!config) throw new Error('SMTP not configured');

  const transporter = nodemailer.createTransporter({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  await transporter.sendMail({
    from: config.fromName ? `"${config.fromName}" <${config.fromEmail}>` : config.fromEmail,
    to,
    subject,
    text,
    html,
  });
}