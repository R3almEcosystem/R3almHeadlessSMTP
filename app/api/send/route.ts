// app/api/send/route.ts – V15.0 – TRUE HEADLESS SMTP (NO RESELL, WORKS ON VERCEL)
//export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { to, subject = "R3alm Test", text = "Hello!", html } = await req.json();

    if (!to) return new Response("Missing 'to'", { status: 400 });

    // Read config safely
    let config: any = { smtp: { host: "mail.r3alm.com", port: 587, user: "no-reply@r3alm.com", pass: "Z3us!@#$1r3alm", fromEmail: "no-reply@r3alm.com", fromName: "R3alm" } };
    try {
      const res = await fetch("https://r3alm-headless-smtp.vercel.app/api/config");
      const data = await res.json();
      if (data.smtp) config = data;
    } catch {}

    const auth = btoa(`${config.smtp.user}:${config.smtp.pass}`);

    const raw = [
      `From: "${config.smtp.fromName}" <${config.smtp.fromEmail}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=UTF-8`,
      ``,
      html || text.replace(/\n/g, "<br>")
    ].join("\r\n");

    const encoded = btoa(unescape(encodeURIComponent(raw)));

    // THIS BYPASSES VERCEL'S SMTP BLOCK — uses HTTP tunnel
    const response = await fetch(`https://smtp-proxy.r3alm.workers.dev/send`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "X-SMTP-Host": config.smtp.host,
        "X-SMTP-Port": config.smtp.port.toString(),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        to,
        from: config.smtp.fromEmail,
        data: encoded
      })
    });

    if (!response.ok) throw new Error("Proxy failed");

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}