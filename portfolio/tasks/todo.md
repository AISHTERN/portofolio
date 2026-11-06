# Task List: Website Portofolio

> Sumber: `SPEC.md` (Rev. 2) dan `tasks/plan.md`. Ukuran: XS 1 file, S 1-2, M 3-5. Tidak ada task yang menyentuh lebih dari 5 file kode (aset gambar tidak dihitung).
> Perintah verifikasi memakai script dari SPEC: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npx playwright test`, `npx lhci autorun`.

---

## Phase 1: Foundation

## Task 1: Scaffold proyek, tooling, dan design tokens tema terang

> **Status: selesai** (dikonfirmasi pemilik setelah menjalankan install, typecheck, lint, test, dan build secara lokal).

**Description:** Buat proyek Vite + React + TypeScript, pasang Tailwind, Framer Motion, ESLint, Prettier, Vitest, dan font (`@fontsource/inter`, `@fontsource/plus-jakarta-sans`). Definisikan design tokens tema terang (warna gading/abu hangat, aksen biru, radius, bayangan lembut) sebagai CSS variables.

**Acceptance criteria:**
- [x] `npm run dev` menampilkan halaman awal bertema terang dengan font Inter dan Plus Jakarta Sans
- [x] Semua script di SPEC (`dev`, `build`, `lint`, `format`, `typecheck`, `test`) ada dan berjalan
- [x] TypeScript `strict: true`; ada satu test contoh yang lulus

**Verification:**
- [x] `npm run typecheck && npm run lint && npm test` hijau
- [x] `npm run build` sukses
- [x] Manual: halaman awal terlihat benar di 375px dan 1280px

**Dependencies:** None

**Files likely touched:**
- `package.json`, `vite.config.ts`, `tailwind.config.ts`
- `src/styles/index.css`, `src/App.tsx`

**Estimated scope:** Small

---

## Task 2: i18n core dan tombol switch ID/EN

> **Status: selesai** (dikonfirmasi pemilik setelah menjalankan typecheck, lint, test, dan cek manual).

**Description:** Bangun `LanguageProvider`, hook `useLang`, tipe `Localized<T> = { id: T; en: T }`, dan komponen `LanguageSwitch` (pil "ID | EN"). Bahasa awal mengikuti browser (selain `id` → English), pilihan disimpan di `localStorage` dengan try/catch, dan `<html lang>` ikut berubah.

**Acceptance criteria:**
- [x] Mengeklik switch mengganti teks contoh antara Indonesia dan English tanpa reload
- [x] Pilihan bertahan setelah refresh; bila storage gagal, situs tetap jalan
- [x] `document.documentElement.lang` bernilai `id` atau `en` sesuai pilihan
- [x] Switch dapat dioperasikan dengan keyboard dan punya label aksesibel

**Verification:**
- [x] `npm test` (unit: pilihan bahasa awal, persist, fallback saat storage error; komponen: klik switch)
- [x] `npm run typecheck`
- [x] Manual: ubah bahasa browser lalu muat ulang

**Dependencies:** Task 1

**Files likely touched:**
- `src/i18n/LanguageProvider.tsx`, `src/i18n/types.ts`
- `src/components/ui/LanguageSwitch.tsx`
- `tests/i18n.test.tsx`

**Estimated scope:** Medium

---

## Task 3: Layout shell: Navbar, Footer, animasi reveal

> **Status: selesai** (dikonfirmasi pemilik setelah menjalankan typecheck, lint, test, dan cek manual).

**Description:** Buat Navbar (tautan anchor ke section, `LanguageSwitch`, menu mobile), Footer, komponen `Reveal` (fade/slide saat scroll, menghormati reduced-motion), smooth scroll, dan *skip link*. Section masih berupa placeholder dengan id yang benar.

**Acceptance criteria:**
- [x] Klik menu menggulir ke section yang tepat; menu mobile terbuka/tutup dan tertutup setelah memilih tautan
- [x] Navbar menandai section aktif saat scroll
- [x] Label navbar dan footer ikut berganti bahasa
- [x] `Reveal` tidak beranimasi saat `prefers-reduced-motion: reduce`

**Verification:**
- [x] `npm test` (komponen: menu mobile, label dua bahasa)
- [x] `npm run build`
- [x] Manual: 375px dan 1280px, navigasi dengan keyboard (Tab, skip link)

**Dependencies:** Task 2

**Files likely touched:**
- `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`
- `src/components/ui/Reveal.tsx`
- `src/App.tsx`, `tests/navbar.test.tsx`

**Estimated scope:** Medium

---

## Checkpoint: Foundation

- [x] `typecheck`, `lint`, `test`, `build` hijau
- [x] Switch bahasa dan navigasi anchor berfungsi di halaman kerangka
- [x] Tampilan terang konsisten dengan tokens
- [x] Review dengan pemilik sebelum lanjut

---

## Phase 2: Core Sections

## Task 4: Hero + foto + CTA WhatsApp/Email + Unduh CV

> **Status: selesai** (dikonfirmasi pemilik setelah menjalankan typecheck, lint, test, dan cek visual).

**Description:** Section Hero dengan nama, peran ("Software Engineer · Google AI Professional"), kalimat singkat dari ringkasan CV, foto formal (`foto_formal.jpeg` → WebP), serta tiga tombol: Chat WhatsApp, Kirim Email, Unduh CV. Tambahkan `lib/contact.ts` (`buildWhatsAppUrl`, `buildMailtoUrl`) dan salin CV ke `public/cv.pdf`.

**Acceptance criteria:**
- [x] Tombol WhatsApp membuka `https://wa.me/6281284945531?text=...` dengan pesan awal sesuai bahasa aktif
- [x] Tombol email membuka `mailto:avalentinocp@gmail.com` dengan subjek sesuai bahasa
- [x] Tombol Unduh CV mengunduh file `CV_Amrullah_Valentino_Caesar_Putra.pdf`
- [x] Foto punya `alt`, `width`/`height`, dan tidak menyebabkan layout shift

**Verification:**
- [x] `npm test` (unit `buildWhatsAppUrl`/`buildMailtoUrl`; komponen: `href` tombol di ID dan EN)
- [x] `npm run build`
- [x] Manual: klik ketiga tombol; cek di 375px dan 1280px

**Dependencies:** Task 3

**Files likely touched:**
- `src/components/sections/Hero.tsx`, `src/data/profile.ts`, `src/lib/contact.ts`
- `public/cv.pdf`, `src/assets/profile.webp`
- `tests/contact.test.ts`

**Estimated scope:** Medium

---

## Task 5: Ikon skill mengambang + section Skill

> **Status: selesai** (dikonfirmasi pemilik setelah `npm install`, typecheck, lint, test, dan cek visual).

**Description:** Buat `FloatingIcon` (animasi naik-turun halus, delay berbeda) dan tampilkan klaster ikon di hero. Buat section Skill yang mengelompokkan skill dari CV (AI & Development, Programming & Web, Data & Database, Hardware & Network, Tools). Ikon: Laravel, PHP, JavaScript, Vue.js, React, Python, HTML5, CSS3, MySQL, PostgreSQL, Git, GitHub, Figma, Postman, Three.js.

**Acceptance criteria:**
- [x] Minimal 6 ikon mengambang di hero (maksimal 10), tanpa layout shift
- [x] Animasi berhenti saat `prefers-reduced-motion: reduce`
- [x] Section Skill menampilkan semua kategori CV dengan label dua bahasa
- [x] Setiap ikon punya `aria-label`; ikon yang tidak tersedia memakai fallback teks

**Verification:**
- [x] `npm test` (komponen: jumlah ikon, atribut aksesibilitas, mode reduced-motion)
- [x] `npm run build`
- [x] Manual: ikon bergerak halus di HP dan desktop; tidak menutupi tombol CTA

**Dependencies:** Task 4

**Files likely touched:**
- `src/components/ui/FloatingIcon.tsx`, `src/components/sections/Skills.tsx`
- `src/data/skills.ts`, `src/components/sections/Hero.tsx`
- `tests/floating-icon.test.tsx`

**Estimated scope:** Medium

---

## Task 6: Tentang, Pengalaman, dan Pendidikan

> **Status:** kode dan test ditulis; sudah diverifikasi: `data.test.ts` nyata (12 lulus) dan 19 pengecekan Chromium. Belum: test Vitest/jsdom, `typecheck`, `lint`, dan tampilan visual (Tailwind tidak tersedia di lingkungan penulisan). Belum dikonfirmasi pemilik; terjemahan Inggris perlu di-review.

**Description:** Section Tentang (ringkasan profesional CV) dan timeline Pengalaman (PT Global Alfa Solusindo, PT Bogajaya Sukses Abadi, CV. Credibug Partner Solutions) serta Pendidikan (Universitas Mercu Buana 2022–2026, SMKN 56 Jakarta 2019–2022). Semua dalam dua bahasa; terjemahan Inggris saya draft.

**Acceptance criteria:**
- [ ] Ringkasan, 3 pengalaman, dan 2 pendidikan tampil sesuai CV, urut terbaru ke terlama
- [ ] Setiap teks punya `id` dan `en`; tes gagal bila ada yang kosong
- [ ] Layout timeline tetap terbaca di 375px

**Verification:**
- [ ] `npm test` (validasi data pengalaman/pendidikan, kelengkapan terjemahan)
- [ ] `npm run build`
- [ ] Manual: bandingkan isi dengan CV; ganti bahasa

**Dependencies:** Task 3

**Files likely touched:**
- `src/components/sections/About.tsx`, `src/components/sections/Experience.tsx`
- `src/data/experience.ts`, `src/data/education.ts`
- `tests/data.test.ts`

**Estimated scope:** Medium

---

## Task 7: Section Proyek

> **Status:** kode dan test ditulis; sudah diverifikasi: `projects-data.test.ts` nyata (4 lulus) dan di Chromium (2 kartu sesuai CV, tanpa tombol tautan, 4 chip berlogo). Belum: test Vitest/jsdom, `typecheck`, `lint`, dan tampilan visual (Tailwind tidak tersedia di lingkungan penulisan).

**Description:** Kartu proyek untuk **Virtual Assistant Chatbot 3D** (React Three Fiber / Three.js + AI) dan **Oh My Cake** (Laravel + MySQL), dengan deskripsi singkat dan label teknologi. Tombol tautan hanya muncul bila data proyek punya URL.

**Acceptance criteria:**
- [ ] Kedua proyek tampil dengan judul, deskripsi, dan label teknologi di ID dan EN
- [ ] Tanpa URL, tidak ada tombol tautan yang rusak; dengan URL, tautan terbuka di tab baru dengan `rel="noopener noreferrer"`
- [ ] Grid responsif: 1 kolom di mobile, 2 kolom di desktop

**Verification:**
- [ ] `npm test` (komponen: kartu dengan dan tanpa URL)
- [ ] `npm run build`
- [ ] Manual: 375px dan 1280px

**Dependencies:** Task 3

**Files likely touched:**
- `src/components/sections/Projects.tsx`, `src/components/ui/Card.tsx`
- `src/data/projects.ts`, `tests/projects.test.tsx`

**Estimated scope:** Small

---

## Task 8: Siapkan aset sertifikat dari PDF

> **Status:** **selesai.** 3 gambar thumbnail (640px) dan 3 gambar besar (1600px) WebP plus 3 PDF di `public/certificates/` (421 KB total, batas 1,5 MB); ketiga gambar diperiksa visual: terbaca dan cocok dengan PDF. Catatan: lokasi memakai `public/` (bukan `src/assets/`) agar menambah sertifikat tidak perlu mengubah kode.

**Description:** Ubah halaman pertama tiga PDF sertifikat menjadi WebP (thumbnail ±600px dan versi besar ±1600px) lewat skrip sekali jalan. Salin PDF asli ke `public/certificates/`. File: Google AI (11 Sep 2026), Introduction to Front-End Development oleh Meta (12 Sep 2026), CCNAv7 Introduction to Networks oleh Cisco (1 Agu 2023).

**Acceptance criteria:**
- [x] 3 thumbnail dan 3 gambar besar WebP ada di `public/certificates/`, teks sertifikat terbaca di versi besar
- [x] Total ukuran gambar sertifikat wajar (≤ 1,5 MB)
- [x] PDF asli tersedia di `public/certificates/` dengan nama bersih

**Verification:**
- [x] Manual: buka tiap gambar dan cocokkan nama, judul, serta tanggal dengan PDF
- [x] `ls -lh public/certificates` memenuhi batas ukuran

**Dependencies:** Task 1

**Files likely touched:**
- `scripts/pdf-to-webp.sh` (atau `.mjs`)
- `public/certificates/*` (gambar WebP dan PDF)`

**Estimated scope:** Small

---

## Task 9: Section Sertifikat + ImageLightbox

> **Status:** kode dan test ditulis; sudah diverifikasi: `certificates-data.test.ts` nyata (4 lulus) dan 29 pengecekan Chromium (kartu, tanggal, tautan verifikasi, 9 berkas merespons 200, lightbox: Enter, panah dan wrap, jebakan fokus 14 tekan Tab, Escape, fokus kembali, klik backdrop, kunci scroll). `ImageLightbox` dibuat sendiri (tanpa library) dan dipakai ulang galeri. Menambah sertifikat = satu entri data + tiga berkas hasil `npm run certs`. Belum: test Vitest/jsdom, `typecheck`, `lint`, dan tampilan visual (Tailwind tidak tersedia di lingkungan penulisan).

**Description:** Section Sertifikat berisi kartu (thumbnail, judul, penerbit, tanggal). Klik membuka `ImageLightbox` (komponen bersama) untuk melihat versi besar. Tiap kartu punya tautan "Verifikasi" bila ada (Google AI: `coursera.org/verify/professional-cert/A1LXK6XLZ3YS`, Meta: `coursera.org/verify/QBNRZNRTYLBJ`; CCNA tanpa tautan verifikasi) dan tautan "Buka PDF".

**Acceptance criteria:**
- [ ] 3 sertifikat tampil sebagai kartu dari `certificates.ts`
- [ ] Klik membuka lightbox; bisa ditutup dengan Esc, tombol, atau klik di luar; fokus kembali ke kartu
- [ ] Tautan verifikasi hanya muncul untuk sertifikat yang memilikinya
- [ ] Menambah sertifikat BNSP kelak hanya butuh satu entri data dan tiga berkas (hasil `npm run certs`)

**Verification:**
- [ ] `npm test` (komponen: buka/tutup lightbox, tautan verifikasi kondisional)
- [ ] `npm run build`
- [ ] Manual: uji dengan keyboard dan di 375px

**Dependencies:** Task 3, Task 8

**Files likely touched:**
- `src/components/sections/Certificates.tsx`, `src/components/ui/ImageLightbox.tsx`
- `src/data/certificates.ts`, `tests/certificates.test.tsx`

**Estimated scope:** Medium

---

## Task 10: Section Kontak

> **Status:** kode dan test ditulis; sudah diverifikasi: 31 pengecekan Chromium bersama Task 11 (href CTA identik di Hero/Kontak/Footer, WhatsApp tab baru tanpa opener, CV terunduh dari Kontak, 4 kartu kontak, footer, English). Belum: test Vitest/jsdom, `typecheck`, `lint`, dan tampilan visual (Tailwind tidak tersedia di lingkungan penulisan).

**Description:** Section Kontak berisi email, WhatsApp, lokasi (Jakarta, Indonesia), dan GitHub, serta dua tombol CTA besar (Chat WhatsApp dan Kirim Email). Footer ikut memuat CTA singkat. Memakai ulang `lib/contact.ts`.

**Acceptance criteria:**
- [ ] Email, nomor WhatsApp, lokasi, dan tautan GitHub (`github.com/AISHTERN`) tampil dan benar
- [ ] Tombol CTA di section Kontak dan footer menghasilkan `href` yang sama dengan hero
- [ ] Teks dan pesan awal WhatsApp mengikuti bahasa aktif

**Verification:**
- [ ] `npm test` (komponen: semua `href` kontak di ID dan EN)
- [ ] `npm run build`
- [ ] Manual: klik setiap tombol

**Dependencies:** Task 4

**Files likely touched:**
- `src/components/sections/Contact.tsx`, `src/components/layout/Footer.tsx`
- `src/data/profile.ts`, `tests/contact-section.test.tsx`

**Estimated scope:** Small

---

## Task 11: Section Galeri dengan empty state, filter, dan lightbox

> **Status:** kode dan test ditulis; sudah diverifikasi: `gallery-data.test.ts` nyata (8 lulus) dan di Chromium: empty state pada halaman asli, serta filter, lightbox pada set terfilter, dan English dengan 4 foto uji. Foto asli menyusul: taruh di `public/gallery/` + satu entri di `src/data/gallery.ts` (lihat `docs/UPDATING_CONTENT.md`). Belum: test Vitest/jsdom, `typecheck`, `lint`, dan tampilan visual (Tailwind tidak tersedia di lingkungan penulisan).

**Description:** Galeri data-driven dengan filter kategori (Pribadi / Proyek / Aktivitas) dan lightbox (memakai `ImageLightbox`, navigasi next/prev dengan keyboard). Karena foto menyusul, `gallery.ts` awalnya kosong dan section menampilkan empty state yang rapi ("Galeri segera hadir"). Test memakai data fixture.

**Acceptance criteria:**
- [ ] Dengan `gallery.ts` kosong, section tampil sebagai empty state, bukan area kosong atau error
- [ ] Dengan data fixture: grid tampil, filter kategori bekerja, lightbox bisa next/prev dengan tombol panah
- [ ] Menambah foto kelak hanya butuh meletakkan file di `public/gallery/` dan menambah entri data
- [ ] Setiap foto wajib punya `alt` dua bahasa (divalidasi test)

**Verification:**
- [ ] `npm test` (unit: filter; komponen: empty state, lightbox next/prev)
- [ ] `npm run build`
- [ ] Manual: ubah data sementara untuk mencoba beberapa foto, lalu kembalikan

**Dependencies:** Task 9

**Files likely touched:**
- `src/components/sections/Gallery.tsx`, `src/data/gallery.ts`
- `src/lib/gallery.ts`, `tests/gallery.test.tsx`

**Estimated scope:** Medium

---

## Checkpoint: Core Sections

- [ ] Semua test hijau dan build bersih
- [ ] Kedelapan fitur permintaan bisa didemokan: desain terang, sertifikat, galeri, proyek, ikon mengambang, unduh CV, info kontak, CTA WhatsApp dan email
- [ ] Switch bahasa mengganti seluruh teks di semua section
- [ ] Review dengan pemilik: isi sesuai CV dan terjemahan Inggris disetujui

---

## Phase 3: Polish dan Rilis

## Task 12: Polish responsif dan motion

> **Status:** sebagian terverifikasi: kontras WCAG AA dihitung dari token asli (12 test nyata; terendah 5,27:1), mode reduced-motion terbukti di Chromium (transisi dan animasi dipangkas, ikon diam, scroll halus mati), audit statis aksesibilitas bersih (dengan uji kontrol negatif). Belum: tampilan responsif 375/768/1280px dan test `@layout` (butuh Tailwind asli), serta `lint`/`test`/`build`.

**Description:** Rapikan spacing, tipografi, dan transisi antar-section; pastikan tidak ada horizontal scroll di 375px, 768px, dan 1280px; terapkan `Reveal` secara konsisten; pastikan kontras teks memenuhi WCAG AA dan fokus keyboard terlihat jelas.

**Acceptance criteria:**
- [ ] Tidak ada horizontal scroll di 375px, 768px, dan 1280px
- [x] Kontras teks dan tombol ≥ WCAG AA; indikator fokus terlihat di semua elemen interaktif
- [x] Semua animasi mati saat `prefers-reduced-motion: reduce`

**Verification:**
- [ ] `npm run lint && npm test && npm run build`
- [ ] Manual: telusuri semua section di 3 lebar layar, ID dan EN

**Dependencies:** Task 5, 6, 7, 9, 10, 11

**Files likely touched:**
- `src/styles/index.css`, beberapa file di `src/components/sections/*`

**Estimated scope:** Medium

---

## Task 13: SEO, meta, dan Open Graph

> **Status:** sebagian terverifikasi: judul/deskripsi/meta berganti sesuai bahasa di browser, `og-image.png` 1200×630 + favicon + ikon sentuh + robots + sitemap valid, JSON-LD valid, fallback tanpa JavaScript, 10 test SEO nyata. Belum: `npm run build` (periksa `dist/index.html`) dan Lighthouse SEO ≥ 95.

**Description:** Isi `<title>`, meta description (dua bahasa singkat), Open Graph/Twitter card, `og-image.png`, favicon, `robots.txt`, `sitemap.xml`, dan JSON-LD `Person`. Judul halaman dan meta ikut diperbarui saat bahasa diganti.

**Acceptance criteria:**
- [x] `<title>` dan meta description terisi dan berganti sesuai bahasa
- [x] `og-image.png` (1200×630) dan favicon tersedia
- [x] JSON-LD `Person` valid (nama, pekerjaan, email, GitHub)

**Verification:**
- [ ] `npm run build` dan periksa `dist/index.html`
- [ ] `npx lhci autorun`: skor SEO ≥ 95

**Dependencies:** Task 12

**Files likely touched:**
- `index.html`, `public/og-image.png`, `public/favicon.svg`
- `public/robots.txt`, `public/sitemap.xml`

**Estimated scope:** Small

---

## Task 14: E2E, Lighthouse CI, dan audit aksesibilitas

> **Status:** spesifikasi ditulis (`e2e/portfolio.spec.ts`, `a11y.spec.ts`, `seo.spec.ts`, `playwright.config.ts`, `lighthouserc.json`). 42 test E2E lulus dengan runner Playwright asli (termasuk penjaga rasio foto Hero) di Chromium 375px dan 1280px terhadap harness; 6 test `@layout` gagal hanya karena CSS Tailwind tidak ada di harness (sudah diklasifikasi, bukan kesalahan spesifikasi). Belum dijalankan: axe, Lighthouse, WebKit, dan test `@layout` pada build asli.

**Description:** Tulis test Playwright (Chromium + WebKit, viewport 375px dan 1280px) untuk alur utama, konfigurasi Lighthouse CI, dan pemeriksaan aksesibilitas otomatis (axe).

**Acceptance criteria:**
- [ ] E2E: semua section tampil; klik Unduh CV memicu download; href WhatsApp/email benar; switch bahasa mengganti teks; lightbox sertifikat buka/tutup
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95; LCP < 2,5 dtk; CLS < 0,1
- [ ] Tidak ada pelanggaran axe tingkat serius/kritis

**Verification:**
- [ ] `npx playwright test`
- [ ] `npx lhci autorun`
- [ ] Cakupan unit/komponen ≥ 80% untuk `src/lib` dan `src/components/ui`

**Dependencies:** Task 13

**Files likely touched:**
- `e2e/portfolio.spec.ts`, `playwright.config.ts`, `lighthouserc.json`
- `package.json`

**Estimated scope:** Medium

---

## Task 15: Deploy ke Vercel dan dokumentasi cara ganti konten

> **Status:** dokumentasi dan konfigurasi ditulis (`README.md`, `docs/UPDATING_CONTENT.md`, `docs/DEPLOY.md`, `docs/VERIFICATION.md`, `vercel.json`, `.github/workflows/ci.yml`). Deploy butuh akun GitHub dan Vercel milik pemilik, jadi belum dilakukan.

**Description:** Siapkan repo GitHub, hubungkan ke Vercel (paket gratis), dan tulis `docs/UPDATING_CONTENT.md` (cara menambah foto galeri, sertifikat BNSP, tautan proyek, CV versi Inggris). **Butuh tindakan pemilik**: akun GitHub/Vercel dan persetujuan sebelum situs publik.

**Acceptance criteria:**
- [ ] Situs live di URL `*.vercel.app` dengan HTTPS, bisa dibuka tanpa login
- [ ] Setiap push ke `main` men-deploy otomatis
- [ ] `docs/UPDATING_CONTENT.md` menjelaskan langkah menambah foto, sertifikat, proyek, dan CV
- [ ] Tidak ada secret atau data pribadi di luar yang sudah disetujui di repo

**Verification:**
- [ ] Buka URL publik di HP dan desktop; jalankan lagi `npx lhci autorun` terhadap URL live
- [ ] Manual: klik Unduh CV, WhatsApp, email, dan switch bahasa di situs live

**Dependencies:** Task 14

**Files likely touched:**
- `docs/UPDATING_CONTENT.md`, `README.md`, `vercel.json` (bila perlu)

**Estimated scope:** Small

---

## Checkpoint: Complete

- [ ] Semua success criteria di `SPEC.md` terpenuhi
- [ ] Tidak ada test yang dilewati atau dihapus
- [ ] Situs live dan sudah di-review pemilik
- [ ] Open questions dijawab atau ditunda secara sadar
