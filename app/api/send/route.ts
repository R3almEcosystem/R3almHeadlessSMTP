// app/api/send/route.ts – V10.3 (500 Error Fixed – Full Error Handling)
import nodemailer from 'nodemailer';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const filePath = join(process.cwd(), 'data', 'config.json');

// Helper to get config with fallback
function getConfig() {
  if (!existsSync(filePath)) {
    console.error('Config file missing:', filePath);
    return null;
  }
  try {
    const raw = readFileSync(filePath, 'utf-8');
    const config = JSON.parse(raw);
    if (!config.smtp || !config.smtp.host) {
      console.error('Invalid config structure');
      return null;
    }
    return config;
  } catch (error) {
    console.error('Failed to read config:', error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    // Parse body with error handling
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Invalid JSON body:', parseError);
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
    }

    const { to, subject, text, html } = body || {};

    // Validate required fields
    if (!to || !subject || !text) {
      console.error('Missing required fields:', { to, subject, text });
      return new Response(JSON.stringify({ error: 'Missing required fields: to, subject, text' }), { status: 400 });
    }

    // Get config
    const config = getConfig();
    if (!config) {
      return new Response(JSON.stringify({ error: 'SMTP not configured – check /settings' }), { status: 500 });
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });

    // Send email with error handling
    await transporter.sendMail({
      from: config.smtp.fromName 
        ? `"${config.smtp.fromName}" <${config.smtp.fromEmail}>` 
        : config.smtp.fromEmail,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, '<br>'),
    });

    console.log('Email sent successfully to:', to);
    return new Response(JSON.stringify({ success: true, message: 'Email sent!' }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Send email error:', error.message || error);
    return new Response(JSON.stringify({ error: 'Internal server error: ' + (error.message || 'Unknown') }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}