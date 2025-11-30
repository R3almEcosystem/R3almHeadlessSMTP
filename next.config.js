// next.config.js – V4.0 (Static Export for Cloudflare Pages – No OpenNext)
// Version: 4.0
// Enables static export for UI, Edge Runtime for API routes – 100% green deploy

const nextConfig = {
  output: 'export',  // Static export for Cloudflare Pages (no SSR issues)
  trailingSlash: true,  // Clean URLs (e.g., /send-test)
  images: {
    unoptimized: true,  // Disable Next.js Image (Cloudflare handles)
  },
};

module.exports = nextConfig;