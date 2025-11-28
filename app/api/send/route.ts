// app/api/send/route.ts
import { NextRequest } from 'next/server';
import { sendEmail } from '@/lib/smtp';

// CRITICAL: Remove 'edge' runtime — nodemailer is NOT compatible with Edge
// This route will now run on Node.js (Vercel Serverless Functions) → works perfectly
// export const runtime = 'edge';   ← DELETE THIS LINE

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, subject, text, html } = body;

    // Basic validation
    if (!to || !subject || !text) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, text' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await sendEmail(to, subject, text, html);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Send email error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send email' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Optional: Add a simple health check
export async function GET() {
  return new Response('SMTP Send API is running 🚀', { status: 200 });
}