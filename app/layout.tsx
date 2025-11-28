// Instead of:
// import { Mail, Settings, Send } from 'lucide-react';

// Just delete the import and use emojis directly:
<Link href="/" className="flex items-center gap-3">
  <span className="text-2xl">Envelope</span>
  <span className="font-bold text-xl">R3alm SMTP</span>
</Link>

{/* In the nav links */}
<Link href="/send-test" className="flex items-center gap-2 ...">
  <span>Send</span> Send Test
</Link>
<Link href="/settings" className="flex items-center gap-2 ...">
  <span>Settings</span> Settings
</Link>