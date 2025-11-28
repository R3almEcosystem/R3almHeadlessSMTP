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

// This satisfies Vercel KV's type requirements perfectly
type KVSafeConfig = Record<string, string | number | boolean | undefined>;

export async function getSMTPConfig(): Promise<SMTPConfig | null> {
  const data = await kv.hgetall<KVSafeConfig>('smtp_config');
  if (!data || Object.keys(data).length === 0) return null;

  return {
    host: data.host as string,
    port: Number(data.port),
    secure: Boolean(data.secure),
    user: data.user as string,
    pass: data.pass as string,
    fromEmail: data.fromEmail as string,
    fromName: data.fromName as string | undefined,
  };
}

export async function saveSMTPConfig(config: SMTPConfig) {
  const safeConfig: KVSafeConfig = {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.user,
    pass: config.pass,
    fromEmail: config.fromEmail,
    fromName: config.fromName,
  };
  await kv.hset('smtp_config', safeConfig);
}

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  const config = await getSMTPConfig();
  if (!config) throw new Error('SMTP not configured');

  const transporter = nodemailer.createTransporter({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
  });

  await transporter.sendMail({
    from: config.fromName ? `"${config.fromName}" <${config.fromEmail}>` : config.fromEmail,
    to,
    subject,
    text,
    html,
  });
}
