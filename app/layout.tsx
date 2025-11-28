// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css'; // optional – create if you want basic styles

export const metadata: Metadata = {
  title: 'Headless SMTP Email App',
  description: 'Configure and send emails via your own SMTP server',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">{children}</body>
    </html>
  );
}