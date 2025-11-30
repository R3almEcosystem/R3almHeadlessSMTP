// open-next.config.ts – V1.0 (OpenNext Cloudflare Config – Node.js Compat for fs/nodemailer)
import type { OpenNextConfig } from '@opennextjs/cloudflare';

const config: OpenNextConfig = {
  // Enable Node.js compatibility for fs, path, nodemailer in API routes
  compatibilityFlags: ['nodejs_compat'],
  
  // Build for Cloudflare Workers/Pages (full Node.js runtime)
  target: 'cloudflare-pages',
  
  // Output to .opennext for dashboard Path setting
  outdir: '.opennext',
  
  // No other changes – defaults work for your static UI + dynamic API
};

export default config;