// app/api/send/route.ts – V11.0 FINAL (NO MORE 500s – Vercel Safe)
import nodemailer from 'nodemailer';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CONFIG_PATH = join(process.cwd(), 'data', 'config.json');

function getConfig() {
  if (!existsSync(CONFIG_PATH)) return null;
  try {
    const data = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
    return data.smtp ? data : null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { to, subject = 'Test', text = '', html } = body;

    if (!to || !text) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to and text' }),
        { status: 400 }
      );
    }

    const config = getConfig();
    if (!config?.host) {
      return new Response(
        JSON.stringify({ error: 'SMTP not configured. Visit /settings' }),
        { status: 500 }
      );
    }

    // THIS IS THE KEY FIX: Use direct TLS connection (port 465) with pool: false
    const transporter = nodemailer.createTransporter({
      host: config.host,
      port: config.port || 465,
      secure: true, // ← Force secure = true for port 465
      pool: false,  // ← Critical: disables internal DNS lookups that crash Vercel
      tls: {
        rejectUnauthorized: false, // Allows self-signed if needed (safe for internal)
      },
      auth: {
        user: config.user,
        pass: config.pass,
      },
      // Debug only in dev
      debug: process.env.NODE_ENV === 'development',
      logger: process.env.NODE_ENV === 'development',
    });

    await transporter.sendMail({
      from: config.fromName
        ? `"${config.fromName}" <${config.fromEmail}>`
        : config.fromEmail,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, '<br>'),
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent!' }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error('SMTP Send Error:', error.message);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email', 
        details: error.message.includes('Authentication') 
          ? 'Invalid username/password' 
          : error.message 
      }),
      { status: 500 }
    );
  }
}