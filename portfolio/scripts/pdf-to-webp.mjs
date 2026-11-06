#!/usr/bin/env node
/**
 * Mengubah halaman pertama PDF sertifikat menjadi gambar WebP untuk situs.
 *
 *   node scripts/pdf-to-webp.mjs <berkas.pdf> <id-sertifikat>
 *
 * Hasil di public/certificates/:
 *   <id>.pdf          salinan PDF asli
 *   <id>-thumb.webp   gambar kartu (lebar 640px)
 *   <id>-full.webp    gambar lightbox (lebar 1600px)
 *
 * Prasyarat: `pdftoppm` (paket poppler-utils) dan `npm i -D sharp` (sudah ada di devDependencies).
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import sharp from "sharp";

const [input, id] = process.argv.slice(2);
if (!input || !id || !/^[a-z0-9-]+$/.test(id)) {
  console.error("Usage: node scripts/pdf-to-webp.mjs <file.pdf> <certificate-id>  (id: a-z, 0-9, -)");
  process.exit(1);
}
if (!existsSync(input)) {
  console.error(`File not found: ${input}`);
  process.exit(1);
}

const outDir = resolve("public/certificates");
mkdirSync(outDir, { recursive: true });

const work = mkdtempSync(join(tmpdir(), "cert-"));
try {
  execFileSync("pdftoppm", ["-f", "1", "-l", "1", "-r", "200", "-png", input, join(work, "page")]);
  const png = readdirSync(work).find((name) => name.endsWith(".png"));
  if (!png) throw new Error("pdftoppm produced no image");

  for (const [suffix, width, quality] of [["thumb", 640, 80], ["full", 1600, 85]]) {
    const out = join(outDir, `${id}-${suffix}.webp`);
    const info = await sharp(join(work, png))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(out);
    console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
  }
  copyFileSync(input, join(outDir, `${id}.pdf`));
  console.log(`${join(outDir, `${id}.pdf`)}  (copied)`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
