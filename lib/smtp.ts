// lib/smtp.ts – V6.1 Local JSON with admin password (dev/testing only)
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const DATA_FILE = path.join(process.cwd(), 'data', 'smtp.json');

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromEmail: string;
  fromName?: string;
}

export interface LocalStore {
  adminPassword: string;
  smtp: SMTPConfig;
}

// Helper: read entire store
function readStore(): LocalStore {
  if (!fs.existsSync(DATA_FILE)) {
    // Auto-create with defaults if missing
    const defaultStore: LocalStore = {
      adminPassword: 'r3alm-dev-2025-change-me',
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
    writeStore(defaultStore);
    return defaultStore;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as LocalStore;
  } catch (error) {
    console.error('Failed to read config, using defaults');
    const fallback: LocalStore = {
      adminPassword: 'fallback-password-123',
      smtp: { host: '', port: 587, secure: true, user: '', pass: '', fromEmail: '', fromName: '' },
    };
    writeStore(fallback);
    return fallback;
  }
}

// Helper: write entire store
function writeStore(store: LocalStore) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

// Public API
export async function getAdminPassword(): Promise<string> {
  return readStore().adminPassword;
}

export async function setAdminPassword(newPassword: string): Promise<void> {
  const store = readStore();
  store.adminPassword = newPassword;
  writeStore(store);
}

export async function getSMTPConfig(): Promise<SMTPConfig | null> {
  const store = readStore();
  const config = store.smtp;
  return config.host ? config : null;
}

export async function saveSMTPConfig(config: SMTPConfig): Promise<void> {
  const store = readStore();
  store.smtp = config;
  writeStore(store);
}

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  const config = await getSMTPConfig();
  if (!config) throw new Error('SMTP not configured – save settings first');

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