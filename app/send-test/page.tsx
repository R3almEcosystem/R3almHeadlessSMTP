// app/send-test/page.tsx
'use client';

import { useState } from 'react';

export default function SendTestPage() {
  const [form, setForm] = useState({ to: '', subject: 'Test from R3alm SMTP', text: 'Hello!\n\nThis is a test email sent from your headless SMTP service.\n\nIt works perfectly! 🎉' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setMessage('');

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Email sent successfully!');
      } else {
        throw new Error(data.error || 'Failed to send');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong');
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Send Test Email</h1>
          <p className="text-gray-600 mb-8">Test your SMTP configuration instantly</p>

          {status === 'success' && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg font-medium">
              {message}
            </div>
          )}
          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg font-medium">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To (recipient email)</label>
              <input
                type="email"
                required
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                placeholder="recipient@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                rows={6}
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 font-mono text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-4 rounded-lg transition text-lg"
            >
              {status === 'sending' ? 'Sending...' : 'Send Test Email'}
            </button>
          </form>

          <div className="mt-10 text-center text-sm text-gray-500">
            API Endpoint: <code className="bg-gray-100 px-2 py-1 rounded">POST /api/send</code>
          </div>
        </div>
      </div>
    </div>
  );
}