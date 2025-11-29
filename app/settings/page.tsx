// app/settings/page.tsx – V12.0 FINAL (R3alm Production Ready)
'use client';

import { useState, useEffect } from 'react';

interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromEmail: string;
  fromName?: string;
}

export default function SettingsPage() {
  const [config, setConfig] = useState<SMTPConfig>({
    host: 'mail.r3alm.com',
    port: 465,
    secure: true,
    user: 'no-reply@r3alm.com',
    pass: 'Z3us!@#$1r3alm',
    fromEmail: 'no-reply@r3alm.com',
    fromName: 'R3alm Ecosystem',
  });
  const [password, setPassword] = useState('');
  const [storedPassword, setStoredPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load existing config
  useEffect(() => {
    fetch('/api/config')
      .then(r => r.json())
      .then(data => {
        if (data.adminPassword) setStoredPassword(data.adminPassword);
        if (data.smtp?.host) {
          setConfig(data.smtp);
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        // First time setup
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);

    const passwordToUse = password || storedPassword || 'Z3us!@#$1';

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminPassword: passwordToUse,
          smtp: config,
        }),
      });

      if (!res.ok) throw new Error();

      setMessage({ type: 'success', text: 'Configuration saved successfully!' });
      setStoredPassword(passwordToUse);
      setIsAuthenticated(true);
      setPassword(''); // Clear input
    } catch {
      setMessage({ type: 'error', text: 'Wrong password or server error' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-3xl font-bold text-white animate-pulse">R3alm Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-12 w-full max-w-lg border border-white/20">
          <h1 className="text-6xl font-black text-center mb-10 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
            R3alm SMTP
          </h1>
          <p className="text-center text-white/80 text-lg mb-8">Enter admin password to unlock</p>
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-8 py-5 text-xl bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition-all"
            autoFocus
          />
          <button
            type="submit"
            disabled={saving}
            className="mt-8 w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-2xl py-6 rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl disabled:opacity-70"
          >
            {saving ? 'Unlocking...' : 'Unlock Settings'}
          </button>
          <p className="text-center text-white/60 text-sm mt-6">Hint: Z3us!@#$1</p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/20">
          <div className="text-center mb-12">
            <h1 className="text-7xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              SMTP Configured
            </h1>
            <p className="text-3xl text-white/90 mt-4">R3alm Headless SMTP is LIVE</p>
          </div>

          {message && (
            <div className={`mb-10 p-6 rounded-2xl text-center text-white font-bold text-2xl ${message.type === 'success' ? 'bg-green-600/80' : 'bg-red-600/80'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <label className="block text-xl font-bold text-cyan-300 mb-3">Host</label>
                <input type="text" value={config.host} onChange={e => setConfig({ ...config, host: e.target.value })} className="w-full px-6 py-5 bg-white/20 border border-white/30 rounded-xl text-white text-lg focus:outline-none focus:ring-4 focus:ring-cyan-500" />
              </div>
              <div>
                <label className="block text-xl font-bold text-cyan-300 mb-3">Port</label>
                <input type="number" value={config.port} onChange={e => setConfig({ ...config, port: Number(e.target.value) })} className="w-full px-6 py-5 bg-white/20 border border-white/30 rounded-xl text-white text-lg focus:outline-none focus:ring-4 focus:ring-cyan-500" />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <input type="checkbox" checked={config.secure} onChange={e => setConfig({ ...config, secure: e.target.checked })} className="w-8 h-8 text-purple-600 rounded focus:ring-purple-500" />
              <span className="text-2xl font-bold text-white">Use Secure Connection (TLS/SSL)</span>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <label className="block text-xl font-bold text-cyan-300 mb-3">Username</label>
                <input type="text" value={config.user} onChange={e => setConfig({ ...config, user: e.target.value })} className="w-full px-6 py-5 bg-white/20 border border-white/30 rounded-xl text-white text-lg focus:outline-none focus:ring-4 focus:ring-cyan-500" />
              </div>
              <div>
                <label className="block text-xl font-bold text-cyan-300 mb-3">Password</label>
                <input type="password" value={config.pass} onChange={e => setConfig({ ...config, pass: e.target.value })} className="w-full px-6 py-5 bg-white/20 border border-white/30 rounded-xl text-white text-lg focus:outline-none focus:ring-4 focus:ring-cyan-500" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <label className="block text-xl font-bold text-cyan-300 mb-3">From Email</label>
                <input type="email" value={config.fromEmail} onChange={e => setConfig({ ...config, fromEmail: e.target.value })} className="w-full px-6 py-5 bg-white/20 border border-white/30 rounded-xl text-white text-lg focus:outline-none focus:ring-4 focus:ring-cyan-500" />
              </div>
              <div>
                <label className="block text-xl font-bold text-cyan-300 mb-3">From Name</label>
                <input type="text" value={config.fromName || ''} onChange={e => setConfig({ ...config, fromName: e.target.value })} className="w-full px-6 py-5 bg-white/20 border border-white/30 rounded-xl text-white text-lg focus:outline-none focus:ring-4 focus:ring-cyan-500" placeholder="R3alm Ecosystem" />
              </div>
            </div>

            <div className="text-center pt-10">
              <button
                type="submit"
                disabled={saving}
                className="px-20 py-8 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-black text-4xl rounded-3xl hover:scale-110 transition-all duration-500 shadow-2xl disabled:opacity-70"
              >
                {saving ? 'Saving...' : 'Save & Lock In'}
              </button>
            </div>
          </form>

          <div className="mt-16 text-center">
            <p className="text-white/80 text-xl">Send emails via:</p>
            <code className="inline-block mt-4 px-10 py-6 bg-black/50 rounded-2xl text-green-400 text-2xl font-mono border border-green-500/50">
              POST https://r3alm-headless-smtp.vercel.app/api/send
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}