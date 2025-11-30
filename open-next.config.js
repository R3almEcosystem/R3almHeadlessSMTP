// open-next.config.ts – V4.0 (OpenNext Cloudflare Config – Fixed Default Export)
// Version: 4.0
// Fixes "config.default cannot be empty" – full Node.js runtime for fs/nodemailer

import type { OpenNextConfig } from '@opennextjs/cloudflare';

const config: OpenNextConfig = {
  // Enable Node.js compatibility for fs, path, nodemailer in API routes
  compatibilityFlags: ['nodejs_compat'],
  
  // Build for Cloudflare Workers/Pages (full Node.js runtime)
  target: 'cloudflare-pages',
  
  // Output to .opennext for dashboard Path setting
  outdir: '.opennext',
  
  // Minimal config – defaults work for your static UI + dynamic API
};

export default config;  // ← THIS LINE FIXES THE ERROR (default export required)