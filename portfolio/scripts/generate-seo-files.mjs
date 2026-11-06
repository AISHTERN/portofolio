#!/usr/bin/env node
/**
 * Menulis public/robots.txt dan public/sitemap.xml dari VITE_SITE_URL.
 * Dijalankan otomatis sebelum `npm run build` (script "prebuild").
 *
 * URL dibaca dari environment, lalu dari berkas .env. Tanpa dependency.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

function readSiteUrl() {
  if (process.env.VITE_SITE_URL) return process.env.VITE_SITE_URL;
  if (existsSync(".env")) {
    const match = readFileSync(".env", "utf8").match(/^VITE_SITE_URL=(.+)$/m);
    if (match) return match[1].trim();
  }
  throw new Error("VITE_SITE_URL is not set (environment or .env)");
}

const site = readSiteUrl().replace(/\/+$/, "");
if (!/^https?:\/\/[^\s/]+$/.test(site)) {
  throw new Error(`VITE_SITE_URL must look like https://example.com (got "${site}")`);
}

const today = new Date().toISOString().slice(0, 10);
mkdirSync("public", { recursive: true });

writeFileSync("public/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
writeFileSync(
  "public/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${site}/</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n</urlset>\n`,
);
console.log(`robots.txt and sitemap.xml written for ${site}`);
