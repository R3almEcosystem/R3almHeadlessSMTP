// app/page.tsx  (optional – replaces default Next.js page)
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">R3alm Headless SMTP</h1>
        <p className="text-xl text-gray-600 mb-10">Your self-hosted email API is ready</p>
        <div className="flex gap-6 justify-center">
          <Link href="/send-test" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition">
            Send Test Email
          </Link>
          <Link href="/settings" className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-50 transition">
            Configure SMTP
          </Link>
        </div>
      </div>
    </div>
  );
}