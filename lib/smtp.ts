// lib/smtp.ts – V8.0 Pure In-Memory + Local JSON (NO Vercel KV, NO fs in prod)
import nodemailer from 'nodemailer';

// In-memory store (persists for the lifetime of the Vercel function)
let memoryStore: {
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
} = {
  adminPassword: 'r3alm-prod-2025-change-in-settings',
  smtp: {
    host: '',
    port: 587,
    secure: true,
    user: '',
    pass: '',
    fromEmail: '',
    fromName: 'R3alm Headless SMTP',
  },
};

// === LOCAL DEV: Load from data/smtp.json if exists ===
if (process.env.NODE_ENV !== 'production') {
  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'data', 'smtp.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      memoryStore = { ...memoryStore, ...data };
      console.log('Loaded config from data/smtp.json');
    }
  } catch (e) {
    console.log('No local config file found – using defaults');
  }
}

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromEmail: string;
  fromName?: string;
}

export async function getAdminPassword(): Promise<string> {
  return memoryStore.adminPassword;
}

export async function setAdminPassword(newPass: string): Promise<void> {
  memoryStore.adminPassword = newPass;
}

export async function getSMTPConfig(): Promise<SMTPConfig | null> {
  const cfg = memoryStore.smtp;
  return cfg.host ? cfg : null;
}

export async function saveSMTPConfig(config: SMTPConfig): Promise<void> {
  memoryStore.smtp = config;
}

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  const config = await getSMTPConfig();
  if (!config) throw new Error('SMTP not configured – go to /settings');

  const transporter = nodemailer.createTransporter({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
  });

  await transporter.sendMail({
    from: config.fromName
      ? `"${config.fromName}" <${config.fromEmail}>`
      : config.fromEmail,
    to,
    subject,
    text,
    html,
  });
}