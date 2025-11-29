// app/send-test/page.tsx – FINAL (Cyberpunk Test Email Page)
'use client';

import { useState } from 'react';

export default function SendTestPage() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('Test Email from R3alm Headless SMTP');
  const [message, setMessage] = useState('Hello from R3alm!\n\nThis is a test email sent from your headless SMTP server.\n\nYou did it. 🔥');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<string>('');

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setResult('');

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          subject,
          text: message,
          html: message.replace(/\n/g, '<br>'),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setResult(`Email sent successfully to ${to}!`);
      } else {
        throw new Error(data.error || 'Failed to send');
      }
    } catch (err: any) {
      setStatus('error');
      setResult(`Error: ${err.message}`);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/20">
          <div className="text-center mb-12">
            <h1 className="text-7xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Send Test Email
            </h1>
            <p className="text-2xl text-white/80 mt-6">Fire a real email through your R3alm SMTP server</p>
          </div>

          {status === 'success' && (
            <div className="mb-10 p-8 bg-green-600/30 border-2 border-green-500 rounded-2xl text-center">
              <p className="text-3xl font-bold text-green-300">SUCCESS</p>
              <p className="text-xl text-white mt-4">{result}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-10 p-8 bg-red-600/30 border-2 border-red-500 rounded-2xl text-center">
              <p className="text-3xl font-bold text-red-300">FAILED</p>
              <p className="text-xl text-white mt-4">{result}</p>
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-10">
            <div>
              <label className="block text-xl font-bold text-cyan-300 mb-4">To (Recipient Email)</label>
              <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-8 py-6 bg-white/20 border border-white/30 rounded-xl text-white text-xl placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-cyan-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xl font-bold text-cyan-300 mb-4">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-8 py-6 bg-white/20 border border-white/30 rounded-xl text-white text-xl focus:outline-none focus:ring-4 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xl font-bold text-cyan-300 mb-4">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                className="w-full px-8 py-6 bg-white/20 border border-white/30 rounded-xl text-white text-lg font-mono focus:outline-none focus:ring-4 focus:ring-cyan-500 resize-none"
              />
            </div>

            <div className="text-center pt-8">
              <button
                type="submit"
                disabled={status === 'sending' || !to}
                className="px-24 py-10 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-black text-5xl rounded-3xl hover:scale-110 transition-all duration-500 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'SENDING...' : 'SEND TEST EMAIL'}
              </button>
            </div>
          </form>

          <div className="mt-16 text-center text-white/60">
            <p className="text-lg">Powered by:</p>
            <code className="inline-block mt-4 px-10 py-6 bg-black/50 rounded-2xl text-green-400 text-2xl font-mono border border-green-500/50">
              mail.r3alm.com:465
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}