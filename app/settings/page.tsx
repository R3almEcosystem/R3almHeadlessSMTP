'use client';

import { useState, useEffect } from 'react';

const PASSWORD = 'change-me-123'; // Match with env later

export default function SettingsPage() {
  const [config, setConfig] = useState({
    host: '', port: 587, secure: false, user: '', pass: '', from: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/settings', {
      headers: { Authorization: `Bearer ${PASSWORD}` }
    })
      .then(r => r.json())
      .then(data => data.host && setConfig(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PASSWORD}`
      },
      body: JSON.stringify(config)
    });

    if (res.ok) {
      setMessage('SMTP settings saved!');
    } else {
      setMessage('Failed to save');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">SMTP Email Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">SMTP Host</label>
          <input
            type="text"
            required
            value={config.host}
            onChange={e => setConfig({ ...config, host: e.target.value })}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Port</label>
            <input
              type="number"
              value={config.port}
              onChange={e => setConfig({ ...config, port: +e.target.value })}
              className="mt-1 block w-full rounded border px-3 py-2"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.secure}
                onChange={e => setConfig({ ...config, secure: e.target.checked })}
              />
              <span>Use SSL/TLS</span>
            </label>
          </div>
        </div>

        <div>
          <label>Username</label>
          <input
            type="text"
            required
            value={config.user}
            onChange={e => setConfig({ ...config, user: e.target.value })}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            required
            value={config.pass}
            onChange={e => setConfig({ ...config, pass: e.target.value })}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label>From Email</label>
          <input
            type="email"
            required
            value={config.from}
            onChange={e => setConfig({ ...config, from: e.target.value })}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save SMTP Settings'}
        </button>

        {message && <p className="mt-4 text-green-600 font-medium">{message}</p>}
      </form>

      <div className="mt-12 p-6 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Test Send (via API)</h2>
        <pre className="text-sm bg-black text-green-400 p-4 rounded overflow-x-auto">
{`curl -X POST https://your-app.vercel.app/api/send \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "test@example.com",
    "subject": "Hello from Edge",
    "text": "This works!",
    "html": "<h1>Hello</h1>"
  }'`}
        </pre>
      </div>
    </div>
  );
}