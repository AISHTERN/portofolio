# Status verifikasi

Kode ditulis di lingkungan **tanpa akses jaringan**, sehingga paket npm (Vite, Tailwind, Vitest, Framer Motion, dan lainnya)
tidak terpasang. Berikut yang sudah dan belum dibuktikan. Jalankan bagian "Belum" di komputer Anda sebelum publikasi.

## Sudah diverifikasi

| Apa | Hasil | Cara |
|---|---|---|
| Sintaks seluruh berkas `.ts`/`.tsx`/`.mjs` | 0 error | Compiler TypeScript (`transpileModule`) dan `node --check` |
| Logika dan data (12 berkas test `.ts`) | 92 test lulus | Dibundel dengan esbuild, dijalankan dengan kode dan `react-icons` asli |
| Kontras warna WCAG AA | 11 pasangan ≥ 4,5:1 (terendah 5,27:1) | Dihitung dari token CSS asli |
| Audit statis aksesibilitas | 12 `<a>`, 8 `<button>`, 4 `<img>`: bersih | `scripts/audit-a11y.mjs`; uji kontrol negatif menangkap 5 masalah yang sengaja ditanam |
| Perilaku di browser | 145 pengecekan, 7 suite | Chromium sungguhan, `index.css` asli, ikon dan gambar asli. Dijalankan sebelum perubahan kecil "CV per bahasa"; setelahnya alur yang sama (termasuk unduh CV dari Hero dan Kontak) dijalankan ulang lewat 42 test E2E di bawah |
| End-to-end | 42 test lulus (21 skenario × 375px dan 1280px), dijalankan ulang pada kode final dan foto profil baru | Runner Playwright asli terhadap bundel aplikasi |
| Aset sertifikat | 3 gambar terbaca, cocok dengan PDF; total 421 KB | Diperiksa visual |
| Pratinjau tautan | `og-image.png` 1200×630, favicon, ikon sentuh 180×180, robots, sitemap, JSON-LD | Diperiksa visual dan di browser |

Yang dibuktikan di browser mencakup: menu mobile, Escape, skip link, menu aktif saat scroll, switch bahasa (teks,
`<html lang>`, `<title>`, meta), unduh CV dengan nama bersih, WhatsApp membuka tab baru tanpa `opener`, pemilihan
`srcset` pada layar 1x dan 2x, animasi ikon yang benar-benar bergerak, mode reduced-motion, lightbox (fokus terjebak,
panah, Escape, fokus kembali), filter galeri, struktur heading tanpa lompatan level, landmark, dan fallback tanpa JavaScript.

## Belum diverifikasi (jalankan di komputer Anda)

| Apa | Perintah |
|---|---|
| Test komponen Vitest (17 berkas `.test.tsx`) | `npm test` |
| Pemeriksaan tipe dan lint | `npm run typecheck && npm run lint` |
| Build produksi | `npm run build` |
| **Tampilan visual dan tata letak** (Tailwind tidak tersedia di lingkungan penulisan) | `npm run dev`, lalu lihat di lebar HP dan desktop |
| 6 test tata letak `@layout` (tanpa scroll samping, menu responsif, posisi ikon, overlay, animasi masuk, rasio foto) | `npm run e2e` |
| Axe-core (WCAG A/AA/2.2) | `npm run e2e` (berkas `e2e/a11y.spec.ts`) |
| Lighthouse (performa, aksesibilitas, SEO, LCP, CLS) | `npm run lhci` |
| WebKit/Safari | `npm run e2e` (proyek `webkit-*`) |
| Animasi masuk Framer Motion yang asli | Terlihat saat `npm run dev` |
| Deploy | Lihat `docs/DEPLOY.md` (butuh akun GitHub dan Vercel Anda) |

## Catatan

- Versi paket di `package.json` ditulis dari ingatan, belum ada `package-lock.json`. Jika `npm install` menolak
  satu versi, ganti dengan versi terdekat yang tersedia.
- Uji browser memakai `framer-motion` pengganti (tanpa animasi) dan tanpa CSS Tailwind. Karena itu hal yang bergantung
  pada kelas Tailwind (posisi, lebar, `fixed`, `hidden`, `md:`) hanya bisa dibuktikan setelah `npm run e2e` pada build asli.
- Kegagalan yang sempat muncul selama pengujian semuanya ditelusuri ke harness uji (stub, URL data, server uji,
  pencocokan nama), bukan ke kode situs, dan tiap kali diperbaiki di harness lalu diuji ulang.
