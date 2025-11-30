// next.config.js – V2.0 (Cloudflare Pages + Real API Routes)
const nextConfig = {
  // DO NOT use output: 'export' → it kills API routes
  // We stay on default serverless mode (Cloudflare Pages handles it perfectly)

  trailingSlash: true,
  images: {
    unoptimized: true, // Cloudflare has its own image optimizer if you want later
  },

  // Remove experimental.runtime & env block – they caused warnings
};

module.exports = nextConfig;