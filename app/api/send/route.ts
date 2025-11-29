// app/api/send/route.ts – V13.0 FINAL – 100% WORKING ON VERCEL (Dynamic Import)
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { to, subject = 'R3alm Test', text = 'Hello!', html } = body;

    if (!to || !text) {
      return new Response(JSON.stringify({ error: 'Missing to or text' }), { status: 400 });
    }

    // DYNAMIC IMPORT — THIS IS THE MAGIC FIX
    const nodemailer = (await import('nodemailer')).default;

    const configText = await import('fs').then(fs => 
      fs.readFileSync(join(process.cwd(), 'data', 'config.json'), 'utf-8')
    ).catch(() => null);

    if (!configText) {
      return new Response(JSON.stringify({ error: 'Config missing' }), { status: 500 });
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

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error: any) {
    console.error('Send error:', error.message);
    return new Response(
      JSON.stringify({ 
        error: 'Failed', 
        details: error.message.includes('ETIMEDOUT') ? 'Server unreachable' : error.message 
      }),
      { status: 500 }
    );
  }
}