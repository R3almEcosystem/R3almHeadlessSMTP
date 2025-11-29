// app/page.tsx
import Link from 'next/link';
import { Mail, Send, Zap, Shield, Rocket, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-lg px-6 py-3 rounded-full text-sm font-bold text-blue-600 mb-8 shadow-xl">
            <Zap className="w-5 h-5" />
            Deployed in 30 seconds • 100% Free • Open Source
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            Headless SMTP<br />
            <span className="text-5xl md:text-7xl">That Actually Looks Good</span>
          </h1>

          <p className="text-2xl text-gray-700 mb-12 max-w-4xl mx-auto font-light">
            Send millions of transactional emails using your own SMTP server.
            No backend. No lock-in. Just beauty and speed.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Link
              href="/send-test"
              className="group inline-flex items-center gap-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl py-6 px-12 rounded-2xl hover:scale-105 transition-all shadow-2xl"
            >
              <Rocket className="w-8 h-8 group-hover:translate-x-2 transition" />
              Send Your First Email Now
            </Link>
            <Link
              href="/settings"
              className="inline-flex items-center gap-4 bg-white/90 backdrop-blur-lg text-gray-800 font-bold text-xl py-6 px-12 rounded-2xl hover:scale-105 transition-all shadow-2xl border-2 border-gray-200"
            >
              <Shield className="w-8 h-8" />
              Configure in 10 Seconds
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-black text-center mb-20 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Why Developers Love It
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Send, title: "One-Line API", desc: "Just POST to /api/send — works with curl, JS, Python, Go..." },
              { icon: Shield, title: "Self-Hosted", desc: "Your SMTP creds never leave your server" },
              { icon: Zap, title: "Zero Latency", desc: "No third-party relay. Direct SMTP connection" },
            ].map((f, i) => (
              <div key={i} className="text-center group">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                  <f.icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-gray-600 text-lg">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-center">
        <p className="text-gray-600 text-lg">
          Built with <span className="text-red-500">♥</span> by the R3alm Ecosystem •{' '}
          <a href="https://github.com/R3almEcosystem/R3almHeadlessSMTP" className="underline font-bold">
            Star on GitHub
          </a>
        </p>
      </footer>
    </>
  );
}
