// app/api/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/smtp';   // ← fixed

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, text, html } = await req.json();

    if (!to || !subject || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await sendEmail(to, subject, text, html);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Send email failed:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}