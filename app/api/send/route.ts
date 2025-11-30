// app/api/send/route.ts – V9.0 (OpenNext + Full Node.js Runtime – Real SMTP Works)
// Version: 9.0
// Runtime: Node.js (via OpenNext) – full nodemailer + TCP sockets

import nodemailer from 'nodemailer';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const filePath = join(process.cwd(), 'data', 'config.json');

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { to, subject = 'R3alm Test', text = '', html } = body;

    if (!to || !text?.trim()) {
      return new Response(JSON.stringify({ error: 'Missing to or text' }), { status: 400 });
    }

    if (!existsSync(filePath)) {
      return new Response(JSON.stringify({ error: 'SMTP config missing – go to /settings' }), { status: 500 });
    }

    const config = JSON.parse(readFileSync(filePath, 'utf-8'));

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