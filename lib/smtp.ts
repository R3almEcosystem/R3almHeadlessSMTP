import nodemailer from 'nodemailer';
import { kv } from '@vercel/kv';

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

export async function getSMTPConfig(): Promise<SMTPConfig | null> {
  return await kv.hgetall<SMTPConfig>('smtp_config');
}

export async function saveSMTPConfig(config: SMTPConfig) {
  await kv.hset('smtp_config', config);
}

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
    from: config.from,
    to,
    subject,
    text,
    html,
  });
}