// app/settings/page.tsx – V6.2 (final, clean, working)
'use client';

import { useState, useEffect } from 'react';
import { getAdminPassword, getSMTPConfig, saveSMTPConfig } from '@/lib/smtp';

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
  const [storedPassword, setStoredPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      const [savedConfig, adminPass] = await Promise.all([
        getSMTPConfig(),
        getAdminPassword(),
      ]);
      if (savedConfig) {
        setConfig(savedConfig);
        setIsAuthenticated(true);
      }
      setStoredPassword(adminPass);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Check admin password
    if (password !== storedPassword) {
      setMessage({ type: 'error', text: 'Wrong admin password' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      await saveSMTPConfig(config);
      setMessage({ type: 'success', text: 'SMTP config saved successfully!' });
      setIsAuthenticated(true);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save config' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600 animate-pulse">Loading settings...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <form onSubmit={handleSubmit} className="glass rounded-2xl shadow-2xl p-10 w-full max-w-md">
          <h1 className="text-4xl font-black text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            R3alm Headless SMTP
          </h1>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 text-lg"
            required
          />
          <button
            type="submit"
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300"
          >
            Unlock Settings
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-3xl shadow-2xl p-10">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SMTP Settings
          </h1>
          <p className="text-xl text-gray-600 mb-10">Configure your email provider</p>

          {message && (
            <div className={`mb-8 p-6 rounded-2xl text-white font-bold text-lg transition-all ${
              message.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-3">Host</label>
                <input
                  type="text"
                  value={config.host}
                  onChange={(e) => setConfig({ ...config, host: e.target.value })}
                  className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 text-lg"
                  placeholder="smtp.gmail.com"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-3">Port</label>
                <input
                  type="number"
                  value={config.port}
                  onChange={(e) => setConfig({ ...config, port: Number(e.target.value) })}
                  className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 text-lg"
                  required
                />
              </div>
            </div>

            <label className="flex items-center gap-4 text-lg">
              <input
                type="checkbox"
                checked={config.secure}
                onChange={(e) => setConfig({ ...config, secure: e.target.checked })}
                className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="font-bold text-gray-700">Use TLS/SSL (Secure)</span>
            </label>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-3">Username</label>
                <input
                  type="text"
                  value={config.user}
                  onChange={(e) => setConfig({ ...config, user: e.target.value })}
                  className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 text-lg"
                  placeholder="you@gmail.com"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-3">App Password</label>
                <input
                  type="password"
                  value={config.pass}
                  onChange={(e) => setConfig({ ...config, pass: e.target.value })}
                  className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 text-lg"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-3">From Email</label>
                <input
                  type="email"
                  value={config.fromEmail}
                  onChange={(e) => setConfig({ ...config, fromEmail: e.target.value })}
                  className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 text-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-3">From Name (optional)</label>
                <input
                  type="text"
                  value={config.fromName}
                  onChange={(e) => setConfig({ ...config, fromName: e.target.value })}
                  className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 text-lg"
                  placeholder="R3alm Notifications"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-70 text-white font-bold py-6 rounded-2xl text-2xl transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              {saving ? 'Saving...' : 'Save SMTP Configuration'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}