import { NextRequest } from 'next/server';
import { sendEmail } from '@/lib/smtp';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, text, html } = await req.json();

    if (!to || !subject || !text) {
      return new Response('Missing required fields', { status: 400 });
    }

    await sendEmail(to, subject, text, html);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send email' }),
      { status: 500 }
    );
  }
}