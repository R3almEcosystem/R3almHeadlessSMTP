// open-next.config.ts – V1.0 (OpenNext Cloudflare Config – Fixes "config.default cannot be empty")
// Version: 1.0
// For full Node.js runtime on Cloudflare Pages (fs, nodemailer TCP support)

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

export default config;