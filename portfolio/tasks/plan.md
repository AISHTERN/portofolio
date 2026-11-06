# Implementation Plan: Website Portofolio Amrullah Valentino Caesar Putra

> Sumber: `SPEC.md` (Rev. 2). Detail tiap task (acceptance, verifikasi, file) ada di `tasks/todo.md`.
> Status: **menunggu review**. Belum ada kode yang ditulis.

## Overview

Situs portofolio statis satu halaman, bertema terang, dua bahasa (Indonesia / English) dengan tombol switch. Menampilkan profil, pengalaman, skill dengan ikon mengambang, 2 proyek, 3 sertifikat yang bisa dilihat pengunjung, galeri (foto menyusul), tombol unduh CV, kontak, serta CTA WhatsApp dan email. Seluruh konten berasal dari CV dan diedit lewat `src/data/*.ts`. Di-host gratis di Vercel.

## Architecture Decisions

- **Satu halaman statis (Vite + React + TS + Tailwind + Framer Motion).** Tidak perlu backend, jadi hosting gratis dan cepat.
- **Konten terpisah dari tampilan.** Semua teks berbentuk `{ id, en }` di `src/data/*.ts`; menambah foto galeri atau sertifikat cukup menambah file dan satu entri.
- **i18n buatan sendiri** (Context + tipe `Localized<T>`), bukan library. Hanya 2 bahasa, dan tipe TypeScript memaksa setiap teks punya terjemahan. Bahasa awal mengikuti browser (jika bukan `id`, pakai English), pilihan disimpan di `localStorage` (dibungkus try/catch).
- **Tema terang dengan aksen biru** yang selaras dengan latar foto formal. Tidak ada dark mode, jadi satu set design tokens.
- **Ikon mengambang = animasi transform/opacity saja** (murah di GPU), dimatikan saat `prefers-reduced-motion`. Ikon dari `react-icons/si` dengan fallback teks bila ikon tidak tersedia.
- **Sertifikat diubah dari PDF menjadi WebP** (thumbnail + versi besar) lewat skrip sekali jalan; PDF asli tetap tersedia sebagai tautan, ditambah tautan verifikasi Coursera.
- **`ImageLightbox` dibuat sekali** di task sertifikat, lalu dipakai ulang oleh galeri.
- **Galeri punya empty state** karena fotonya menyusul; section tetap tampil rapi dengan pesan "segera hadir".
- **Pemotongan vertikal:** tiap section dikerjakan lengkap (data + komponen + terjemahan + test), bukan semua data dulu baru semua UI.

## Dependency Graph

```
T1 Scaffold + tokens + tooling
 ├─ T8 Aset sertifikat (PDF → WebP)
 └─ T2 i18n core + LanguageSwitch
     └─ T3 Layout shell (Navbar, Footer, Reveal)
         ├─ T4 Hero + CTA + Unduh CV ──┬─ T5 Ikon mengambang + Skill
         │                             └─ T10 Kontak
         ├─ T6 Tentang + Pengalaman + Pendidikan
         ├─ T7 Proyek
         └─ T9 Sertifikat + ImageLightbox (butuh T3 dan T8)
             └─ T11 Galeri
 T5, T6, T7, T9, T10, T11 ── T12 Polish ── T13 SEO ── T14 E2E + Lighthouse + a11y ── T15 Deploy + docs
```

T8 hanya butuh T1, jadi bisa jalan lebih awal. Setelah T3, task T4, T6, T7 bisa dikerjakan paralel (file berbeda). T5 dan T10 menunggu T4 karena memakai `lib/contact.ts` dan layout hero. Galeri (T11) menunggu T9 karena memakai `ImageLightbox`.

## Task List

Ringkasan indeks (detail di `tasks/todo.md`):

### Phase 1: Foundation
- [x] T1: Scaffold proyek, tooling, dan design tokens tema terang (S)
- [x] T2: i18n core dan tombol switch ID/EN (M)
- [x] T3: Layout shell: Navbar, Footer, animasi reveal (M)

### Checkpoint: Foundation
- [x] Lint, typecheck, test, dan build hijau; switch bahasa berfungsi pada halaman kosong

### Phase 2: Core Sections
- [x] T4: Hero + foto + CTA WhatsApp/Email + Unduh CV (M)
- [x] T5: Ikon skill mengambang + section Skill (M)
- [ ] T6: Tentang, Pengalaman, dan Pendidikan (M)
- [ ] T7: Section Proyek (S)
- [x] T8: Siapkan aset sertifikat dari PDF (S)
- [ ] T9: Section Sertifikat + ImageLightbox (M)
- [ ] T10: Section Kontak (S)
- [ ] T11: Section Galeri dengan empty state, filter, dan lightbox (M)

### Checkpoint: Core Sections
- [ ] Semua 8 fitur permintaan dapat didemokan end-to-end dalam ID dan EN

### Phase 3: Polish dan Rilis
- [ ] T12: Polish responsif dan motion (M)
- [ ] T13: SEO, meta, dan Open Graph (S)
- [ ] T14: E2E, Lighthouse CI, dan audit aksesibilitas (M)
- [ ] T15: Deploy ke Vercel dan dokumentasi cara ganti konten (S)

### Checkpoint: Complete
- [ ] Semua success criteria di SPEC.md terpenuhi; situs live di URL publik

## Risks and Mitigations

| Risk | Impact | Mitigasi |
|---|---|---|
| Ikon tertentu (mis. VS Code) tidak ada di `react-icons/si` | Low | Cek ketersediaan di T5; ganti ikon atau fallback ke label teks. VS Code tidak masuk daftar ikon mengambang |
| Terjemahan Inggris kurang pas | Med | Saya draft dari CV; pemilik me-review sebelum T15; tipe `Localized<T>` mencegah teks tertinggal |
| Animasi berat di HP kelas bawah | Med | Hanya animasi `transform`/`opacity`, jumlah ikon dibatasi (≤ 10), dimatikan di reduced-motion; diukur di Lighthouse (T14) |
| Latar foto biru pekat bentrok dengan tema terang | Low | Foto dibingkai kartu membulat dan aksen biru dipakai sebagai warna utama |
| Pratinjau tautan (Open Graph) tidak bisa berganti bahasa | Low | Meta description ditulis dua bahasa singkat; diterima sebagai keterbatasan situs statis |
| Nomor HP tampil publik memicu spam | Low | Sudah ada di CV yang bisa diunduh publik; WhatsApp dipakai lewat tombol, nomor tidak perlu ditulis besar |
| Sertifikat BNSP belum ada file | Low | Data-driven: tambah entri dan file saat tersedia, tanpa ubah komponen |
| Galeri kosong terlihat belum selesai | Low | Empty state yang dirancang rapi; section bisa disembunyikan lewat satu flag di `gallery.ts` bila diinginkan |
| Deploy butuh akun GitHub dan Vercel pemilik | Med | T15 ditandai butuh tindakan pemilik; langkah dirinci di `docs/` |

## Open Questions

Masih sama dengan `SPEC.md`; default sudah ditentukan sehingga tidak memblokir implementasi:

1. File sertifikat BNSP (default: belum ditampilkan).
2. Tautan demo/GitHub proyek (default: tanpa tombol tautan).
3. CV versi Inggris (default: mode English mengunduh CV Indonesia).
4. Media sosial selain GitHub (default: hanya GitHub).
5. Nama subdomain Vercel (default: `amrullah-valentino`).
6. Bahasa awal (default: mengikuti bahasa browser).

## Catatan Implementasi (penyimpangan dari rencana awal)

| Rencana | Yang dilakukan | Alasan |
|---|---|---|
| Lightbox pakai `yet-another-react-lightbox` | Komponen `ImageLightbox` sendiri | Tanpa dependency baru, bisa diuji, dan dipakai ulang sertifikat dan galeri |
| Aset sertifikat/galeri di `src/assets/` | Di `public/certificates/` dan `public/gallery/` | Menambah berkas dan satu entri data tanpa mengubah kode atau impor |
| Satu file CV | CV per bahasa (`PROFILE.cv.id` / `.en`) | Mode English bisa memakai CV Inggris nanti dengan mengganti satu baris |
| Section placeholder di `App` | Semua section nyata, urutan dijaga test | Placeholder tidak lagi dibutuhkan |
| (tambahan) | `scripts/audit-a11y.mjs`, `scripts/make-brand-assets.mjs`, `scripts/generate-seo-files.mjs` | Audit aksesibilitas statis, aset pratinjau tautan, robots/sitemap dari `VITE_SITE_URL` |
