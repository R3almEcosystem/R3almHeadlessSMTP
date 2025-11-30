// open-next.config.js – V16.0 (JavaScript version – bypasses OpenNext TS bug in CI)
// Version: 16.0
// This file is intentionally .js — fixes the "config.default cannot be empty" bug in v1.14.0

/** @type {import('@opennextjs/cloudflare').OpenNextConfig} */
const config = {
  compatibilityFlags: ['nodejs_compat'],
  target: 'cloudflare-pages',
  outdir: '.opennext',
};

module.exports = config;