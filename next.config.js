// next.config.js – V1.0 (Cloudflare Pages Optimization)
const nextConfig = {
  output: 'export',  // Static export for Cloudflare Pages (no SSR issues)
  trailingSlash: true,  // Ensures /send-test/ works
  images: {
    unoptimized: true,  // Disable Next.js Image (use Cloudflare Images if needed)
  },
  experimental: {
    runtime: 'edge',  // Edge runtime for API routes (fast, no Node crashes)
  },
  env: {
    // Your SMTP secrets (override in Cloudflare dashboard)
    SMTP_HOST: 'mail.r3alm.com',
    SMTP_PORT: 587,
    SMTP_USER: 'no-reply@r3alm.com',
    SMTP_PASS: 'Z3us!@#$1r3alm',
    SMTP_FROM: 'no-reply@r3alm.com',
    SMTP_NAME: 'R3alm Ecosystem',
  },
};

module.exports = nextConfig;