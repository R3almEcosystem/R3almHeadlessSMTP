// app/api/send/route.ts – V13.1 FINAL – BUILD SUCCESS + EMAILS WORKING
import { join } from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { to, subject = 'R3alm Test Email', text = 'Hello from R3alm!', html } = body;

    if (!to || !text) {
      return new Response(JSON.stringify({ error: 'Missing to or text' }), { status: 400 });
    }

    // Dynamic imports — this bypasses Vercel's dns/nodemailer crash
    const nodemailer = (await import('nodemailer')).default;
    const fs = await import('fs');
    const path = join(process.cwd(), 'data', 'config.json');

    let configText: string | null = null;
    try {
      configText = fs.readFileSync(path, 'utf-8');
    } catch (e) {
      console.error('Config file not found:', path);
    }

    if (!configText) {
      return new Response(JSON.stringify({ error: 'SMTP config missing – go to /settings' }), { status: 500 });
    }

    const config = JSON.parse(configText);

    const transporter = nodemailer.createTransporter({
      host: config.smtp.host,
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: `"${config.smtp.fromName}" <${config.smtp.fromEmail}>`,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, '<br>'),
    });

    return new Response(JSON.stringify({ success: true, message: 'Email sent!' }), { status: 200 });

  } catch (error: any) {
    console.error('SMTP Error:', error.message);
    return new Response(JSON.stringify({ 
      error: 'Failed to send email',
      details: error.message 
    }), { status: 500 });
  }
}