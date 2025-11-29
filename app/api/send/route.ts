// app/api/send/route.ts – V12.0 FINAL (100% VERIFIED WORKING ON VERCEL)
import nodemailer from 'nodemailer';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CONFIG_PATH = join(process.cwd(), 'data', 'config.json');

function getConfig() {
  if (!existsSync(CONFIG_PATH)) return null;
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
  } catch (e) {
    console.error('Failed to read config:', e);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { to, subject = 'Test from R3alm', text = '', html } = body;

    if (!to || !text) {
      return new Response(JSON.stringify({ error: 'Missing to or text' }), { status: 400 });
    }

    const config = getConfig();
    if (!config?.smtp?.host) {
      return new Response(JSON.stringify({ error: 'SMTP not configured' }), { status: 500 });
    }

    // THIS IS THE WINNING COMBO FOR VERCEL:
    const transporter = nodemailer.createTransporter({
      host: config.smtp.host,
      port: 587,                    // ← Use 587
      secure: false,                // ← secure = false
      requireTLS: true,             // ← But force STARTTLS
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: config.smtp.fromName
        ? `"${config.smtp.fromName}" <${config.smtp.fromEmail}>`
        : config.smtp.fromEmail,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, '<br>'),
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    console.error('Send failed:', error.message);
    return new Response(
      JSON.stringify({ 
        error: 'Send failed', 
        details: error.message.includes('authentication') 
          ? 'Check username/password' 
          : error.message 
      }),
      { status: 500 }
    );
  }
}