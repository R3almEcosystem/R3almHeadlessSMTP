// app/layout.tsx
import './globals.css';
import Link from 'next/link';
import { Mail, Send, Settings } from 'lucide-react';

export const metadata = {
  title: 'R3alm Headless SMTP',
  description: 'The most beautiful way to send emails without a backend',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Glass Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-20">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl group-hover:scale-110 transition-transform">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  R3alm SMTP
                </span>
              </Link>

              <div className="flex items-center gap-10">
                <Link
                  href="/send-test"
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 font-semibold transition group"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition" />
                  Send Test
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 text-gray-700 hover:text-purple-600 font-semibold transition group"
                >
                  <Settings className="w-5 h-5 group-hover:rotate-90 transition" />
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
