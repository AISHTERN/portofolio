# Portofolio Amrullah Valentino Caesar Putra

Situs portofolio pribadi: satu halaman, tema terang, minimalis, dua bahasa (Indonesia / English) dengan tombol switch.
Isinya bersumber dari CV: profil, pengalaman, skill dengan ikon mengambang, proyek, sertifikat yang bisa dilihat
pengunjung, galeri, unduh CV, kontak, dan tombol WhatsApp/email.

**Stack:** Vite · React 18 · TypeScript · Tailwind CSS · Framer Motion · react-icons. Situs statis, tanpa backend,
di-host gratis di Vercel.

## Mulai

```bash
npm install
npm run dev          # http://localhost:5173
```

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev` / `build` / `preview` | Server pengembangan, build produksi, pratinjau build |
| `npm run typecheck` · `lint` · `format` | Pemeriksaan tipe, lint, dan format kode |
| `npm test` | Test unit dan komponen (Vitest + Testing Library) |
| `npm run audit:a11y` | Audit statis aksesibilitas kode (fokus terlihat, `alt`, `type`, `rel`) |
| `npm run e2e` | Test end-to-end Playwright (Chromium + WebKit, 375px dan 1280px) dan axe |
| `npm run lhci` | Lighthouse CI: performa ≥ 90, aksesibilitas ≥ 95, SEO ≥ 95 |
| `npm run certs -- file.pdf id` | Ubah PDF sertifikat menjadi gambar WebP untuk situs |
| `npm run brand` | Buat ulang favicon, ikon sentuh, dan gambar pratinjau tautan (`og-image.png`) |

## Struktur

```
src/
├── components/{layout,sections,ui}/   Navbar, Footer, section halaman, komponen bersama
├── data/                              SEMUA konten (profil, skill, pengalaman, proyek, sertifikat, galeri)
├── i18n/                              Penyedia bahasa dan tipe Localized { id, en }
├── hooks/  lib/                       Hook dan fungsi bantu (kontak, tanggal, SEO, filter galeri)
├── assets/                            Foto profil (WebP, 2 ukuran)
└── styles/index.css                   Token warna tema terang dan animasi
public/                                cv.pdf · certificates/ · gallery/ · favicon · og-image · robots · sitemap
tests/  e2e/                           Test unit/komponen dan end-to-end
scripts/                               Alat bantu (sertifikat, aset merek, SEO, audit aksesibilitas)
docs/                                  Panduan ubah konten, deploy, dan status verifikasi
tasks/  SPEC.md                        Spesifikasi, rencana, dan daftar task
```

Prinsip: **konten diedit lewat `src/data/*.ts`**, tanpa menyentuh komponen. Setiap teks berbentuk
`{ id: "…", en: "…" }`, dan test memastikan keduanya terisi.

## Dokumentasi

- [`docs/UPDATING_CONTENT.md`](docs/UPDATING_CONTENT.md): menambah foto galeri, sertifikat BNSP, tautan proyek, CV Inggris, dan lainnya
- [`docs/DEPLOY.md`](docs/DEPLOY.md): deploy gratis ke Vercel langkah demi langkah
- [`docs/VERIFICATION.md`](docs/VERIFICATION.md): apa yang sudah dan belum diverifikasi
- [`SPEC.md`](SPEC.md) · [`tasks/plan.md`](tasks/plan.md) · [`tasks/todo.md`](tasks/todo.md)
