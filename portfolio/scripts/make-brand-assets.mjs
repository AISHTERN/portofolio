#!/usr/bin/env node
/**
 * Membuat public/favicon.svg, public/apple-touch-icon.png, dan public/og-image.png (1200x630).
 *
 *   npm run brand
 *
 * Prasyarat: sharp (devDependency). Teks memakai font sans-serif sistem, jadi tampilannya
 * sedikit bergantung pada font mesin yang menjalankan skrip.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const ACCENT = "#1D4ED8";
const ACCENT_SOFT = "#E8EEFB";
const CANVAS = "#FAFAF7";
const INK = "#16181D";
const MUTED = "#5B6270";
const FONT = "'Plus Jakarta Sans', 'Inter', 'Helvetica Neue', Arial, sans-serif";

const monogram = (rx) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="${rx}" fill="${ACCENT}"/>
  <text x="32" y="43" text-anchor="middle" font-family="${FONT}" font-size="30" font-weight="700" fill="#fff">AV</text>
</svg>`;

// ---- favicon + apple touch icon ----
writeFileSync("public/favicon.svg", monogram(16));
await sharp(Buffer.from(monogram(0)), { density: 384 }).resize(180, 180).png().toFile("public/apple-touch-icon.png");

// ---- Open Graph card ----
let host = "amrullah-valentino.vercel.app";
if (existsSync(".env")) {
  const match = readFileSync(".env", "utf8").match(/^VITE_SITE_URL=https?:\/\/(.+)$/m);
  if (match) host = match[1].trim().replace(/\/+$/, "");
}

const W = 1200, H = 630;
const PHOTO_W = 420, PHOTO_H = 480, PHOTO_X = 700, PHOTO_Y = 75;

const background = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${CANVAS}"/>
  <rect x="${PHOTO_X + 22}" y="${PHOTO_Y + 22}" width="${PHOTO_W}" height="${PHOTO_H}" rx="40" fill="${ACCENT_SOFT}" transform="rotate(4 ${PHOTO_X + 232} ${PHOTO_Y + 262})"/>
  <rect x="0" y="0" width="12" height="${H}" fill="${ACCENT}"/>
</svg>`;

const text = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="${FONT}">
  <text x="80" y="150" font-size="22" font-weight="700" letter-spacing="5" fill="${ACCENT}">PORTFOLIO</text>
  <text x="80" y="240" font-size="52" font-weight="700" fill="${INK}">Amrullah Valentino</text>
  <text x="80" y="304" font-size="52" font-weight="700" fill="${INK}">Caesar Putra</text>
  <text x="80" y="372" font-size="26" font-weight="600" fill="${MUTED}">Software Engineer · Google AI Professional</text>
  <rect x="80" y="410" width="284" height="44" rx="22" fill="${ACCENT_SOFT}"/>
  <text x="104" y="440" font-size="20" font-weight="600" fill="${ACCENT}">Full Stack · AI · SEO · IT</text>
  <text x="80" y="566" font-size="22" font-weight="500" fill="${MUTED}">${host}</text>
</svg>`;

const roundedMask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${PHOTO_W}" height="${PHOTO_H}"><rect width="${PHOTO_W}" height="${PHOTO_H}" rx="40"/></svg>`,
);
// Foto potret 3:4 diperkecil selebar kartu, lalu dipotong mulai dari PHOTO_CROP_TOP piksel
// dari atas supaya wajah, bahu, dan dasi terlihat (ruang kosong di atas kepala dibuang).
const PHOTO_CROP_TOP = 64;
const photo = await sharp(
  await sharp("src/assets/profile-800.webp").resize({ width: PHOTO_W }).toBuffer(),
)
  .extract({ left: 0, top: PHOTO_CROP_TOP, width: PHOTO_W, height: PHOTO_H })
  .composite([{ input: roundedMask, blend: "dest-in" }])
  .png()
  .toBuffer();

await sharp(Buffer.from(background))
  .composite([
    { input: photo, left: PHOTO_X, top: PHOTO_Y },
    { input: Buffer.from(text), left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile("public/og-image.png");

console.log("wrote public/favicon.svg, public/apple-touch-icon.png, public/og-image.png");
