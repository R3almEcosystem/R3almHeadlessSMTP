// app/api/send/route.ts – V11.0 (Edge Runtime + Polyfills for Cloudflare Pages)
// Version: 11.0
// Bundles with next-on-pages – fs polyfill with Fetch for config.json

export const runtime = 'edge';  // Required for Cloudflare Pages API routes

import nodemailer from 'nodemailer';

// Polyfill for fs.readFileSync (Edge Runtime has no fs)
async function readConfig(): Promise<any> {
  try {
    const response = await fetch('/config.json');
    if (!response.ok) throw new Error('Config not found');
    return await response.json();
  } catch {
    return {
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
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { to, subject = 'R3alm Test', text = '', html } = body;

    if (!to || !text?.trim()) {
      return new Response(JSON.stringify({ error: 'Missing to or text' }), { status: 400 });
    }

    const config = await readConfig();

    const transporter = nodemailer.createTransporter({
      host: config.smtp.host,
      port: config.smtp.port || 587,
      secure: config.smtp.secure || false,
      requireTLS: true,
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
    console.error('SMTP Error:', error.message);
    return new Response(JSON.stringify({ error: error.message || 'Failed to send email' }), { status: 500 });
  }
}