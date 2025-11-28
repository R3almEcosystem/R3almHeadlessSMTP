// app/layout.tsx   (replace your current root layout with this)
import './globals.css';
import Link from 'next/link';
import { Mail, Settings, Send } from 'lucide-react';

export const metadata = {
  title: 'R3alm Headless SMTP',
  description: 'Self-hosted email API – no backend required',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo / Brand */}
              <Link href="/" className="flex items-center gap-3">
                <Mail className="w-8 h-8 text-blue-600" />
                <span className="font-bold text-xl">R3alm SMTP</span>
              </Link>

              {/* Nav Links */}
              <div className="flex items-center gap-8">
                <Link
                  href="/send-test"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  <Send className="w-4 h-4" />
                  Send Test
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}