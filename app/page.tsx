// app/dashboard/page.tsx
export default function Dashboard() {
  return (
    <div style={{ padding: 40, fontFamily: 'system-ui' }}>
      <h1>R3alm Headless SMTP – V4</h1>
      <p>API is live:</p>
      <ul>
        <li>GET/POST → /api/settings</li>
        <li>POST → /api/send</li>
      </ul>
      <p><strong>Delete this page anytime – it’s just a placeholder</strong></p>
    </div>
  );
}