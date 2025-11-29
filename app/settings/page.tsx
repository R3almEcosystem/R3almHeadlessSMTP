// app/settings/page.tsx – V4.2
'use client';

import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'change-me-immediately'; // V4.2: Use env for security

export default function SettingsPage() {
  const [config, setConfig] = useState({
    host: '',
    port: 587,
    secure: true,
    user: '',
    pass: '',
    fromEmail: '',
    fromName: '',
  });
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load config on mount
  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      const res = await fetch('/api/settings', {
        headers: { Authorization: `Bearer ${ADMIN_PASSWORD}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.log('No config yet or wrong password');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== ADMIN_PASSWORD) {
      setMessage({ type: 'error', text: 'Wrong password' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ADMIN_PASSWORD}`,
        },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'SMTP config saved successfully!' });
        setIsAuthenticated(true);
      } else {
        throw new Error('Failed to save');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save config' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <form onSubmit={handleSubmit} className="glass rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-black text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            R3alm Headless SMTP
          </h1>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
          <button
            type="submit"
            className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:scale-105 transition-all duration-300"
          >
            Unlock Settings
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SMTP Settings
          </h1>
          <p className="text-gray-600 mb-8">Configure your email provider</p>

          {message && (
            <div
              className={`mb-6 p-4 rounded-xl text-white font-bold transition-all ${
                message.type === 'success' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 animate-pulse' 
                  : 'bg-gradient-to-r from-red-500 to-red-600'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Host</label>
                <input
                  type="text"
                  value={config.host}
                  onChange={(e) => setConfig({ ...config, host: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="smtp.gmail.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Port</label>
                <input
                  type="number"
                  value={config.port}
                  onChange={(e) => setConfig({ ...config, port: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.secure}
                  onChange={(e) => setConfig({ ...config, secure: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 transition-all"
                />
                <span className="text-sm font-bold text-gray-700">Use TLS/SSL (Secure)</span>
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={config.user}
                  onChange={(e) => setConfig({ ...config, user: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="your-email@gmail.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={config.pass}
                  onChange={(e) => setConfig({ ...config, pass: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">From Email</label>
                <input
                  type="email"
                  value={config.fromEmail}
                  onChange={(e) => setConfig({ ...config, fromEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">From Name (optional)</label>
                <input
                  type="text"
                  value={config.fromName}
                  onChange={(e) => setConfig({ ...config, fromName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="R3alm Notifications"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-70 text-white font-bold py-4 rounded-xl transition-all duration-300 text-lg hover:scale-105"
              >
                {saving ? 'Saving...' : 'Save SMTP Configuration'}
              </button>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>Headless SMTP API is live at:</p>
            <code className="bg-gray-100 px-3 py-1 rounded mt-2 inline-block font-mono">
              POST /api/send
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}