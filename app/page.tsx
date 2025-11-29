// app/page.tsx
import Link from 'next/link';
import { Mail, Send, Settings, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            100% Self-hosted • No backend needed
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            R3alm Headless SMTP
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Send transactional emails instantly using your own SMTP server. 
            Zero backend, zero lock-in, fully open source.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/send-test"
              className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-10 rounded-xl text-lg transition shadow-lg"
            >
              <Send className="w-6 h-6" />
              Send Your First Email
            </Link>
            <Link
              href="/settings"
              className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 font-bold py-5 px-10 rounded-xl text-lg transition shadow-lg"
            >
              <Settings className="w-6 h-6" />
              Configure SMTP
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Everything you need</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Delivery</h3>
              <p className="text-gray-600">Send emails directly via your SMTP provider</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Zero Config API</h3>
              <p className="text-gray-600">Just POST to /api/send — works with any language</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Settings className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Beautiful Dashboard</h3>
              <p className="text-gray-600">Configure and test everything in one place</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-gray-500">
        <p className="text-sm">
          R3alm Headless SMTP • Open Source • Deployed on Vercel
        </p>
      </footer>
    </div>
  );
}
