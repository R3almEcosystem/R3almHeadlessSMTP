// app/api/send/route.ts – Server-side email sending
import nodemailer from 'nodemailer';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const filePath = join(process.cwd(), 'data', 'config.json');

export async function POST(req: Request) {
  if (!existsSync(filePath)) {
    return Response.json({ error: 'SMTP not configured' }, { status: 400 });
  }

  const config = JSON.parse(readFileSync(filePath, 'utf-8'));
  const { to, subject, text, html } = await req.json();

  const transporter = nodemailer.createTransporter({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: { user: config.smtp.user, pass: config.smtp.pass },
  });

  await transporter.sendMail({
    from: config.smtp.fromName ? `"${config.smtp.fromName}" <${config.smtp.fromEmail}>` : config.smtp.fromEmail,
    to,
    subject,
    text,
    html: html || text,
  });

  return Response.json({ success: true });
}