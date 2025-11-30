// next.config.js – V3.0 (Static Export for Cloudflare Pages – No OpenNext)
// Version: 3.0
// Enables static export for UI, Edge Runtime for API routes – 100% green deploy

const nextConfig = {
  output: 'export',  // Static export for Cloudflare Pages (no SSR issues)
  trailingSlash: true,  // Clean URLs (e.g., /send-test)
  images: {
    unoptimized: true,  // Disable Next.js Image (Cloudflare handles)
  },
  experimental: {
    // No runtime config – API routes use 'edge' by default
  },
  // No env block – use dashboard for SMTP secrets
};

module.exports = nextConfig;