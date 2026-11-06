# Spec: Website Portofolio Pribadi

> Status: **Rev. 3** — seluruh task 1-15 sudah diimplementasikan. Status verifikasi ada di `docs/VERIFICATION.md` dan `tasks/todo.md`.

## Asumsi yang Dipakai

1. Website adalah **situs statis satu halaman (single page)** dengan navigasi antar-section, tanpa backend dan tanpa login.
2. Publik, bisa diakses siapa saja tanpa akun. Di-host gratis (Vercel / Netlify / GitHub Pages).
3. Seluruh konten **bersumber dari CV** (Amrullah Valentino Caesar Putra) dan 3 file sertifikat yang diunggah. Foto galeri **menyusul**, jadi galeri dibangun dengan *empty state* dan siap diisi.
4. Bahasa: **dua mode, Indonesia dan Inggris**, dengan tombol switch di navbar. Terjemahan Inggris saya draft dari CV, pemilik me-review.
5. Target browser: versi modern (Chrome, Safari, Firefox, Edge — 2 versi terakhir), desktop dan mobile.
6. Tidak ada form kontak. Kontak lewat link langsung: WhatsApp (`wa.me`) dan email (`mailto:`).
7. CV adalah `CV_Amrullah_Valentino_Caesar_Putra_SEO.pdf` yang diunggah (berbahasa Indonesia), disimpan sebagai `public/cv.pdf`.
8. Tema **terang** saja (tanpa dark mode). Aksen biru agar selaras dengan latar foto formal.
9. Hosting **gratis** (Vercel, subdomain `*.vercel.app`).
10. "Animasi mengambang" = ikon/logo skill (mis. React, Python, Figma) yang melayang pelan di hero atau section skill, seperti desain di CV.

## Objective

Membangun website portofolio pribadi yang modern, minimalis, dan estetik untuk memperkenalkan diri, menampilkan karya, dan memudahkan orang menghubungi pemilik.

**Pengguna:** recruiter, calon klien, kolega, dan siapa pun yang membuka tautan portofolio.

**Fitur (dari permintaan):**

| # | Fitur | Deskripsi |
|---|---|---|
| F1 | Desain | Modern, minimalis, aesthetic, **nuansa terang**; responsif; mendukung `prefers-reduced-motion` |
| F2 | Sertifikat | Daftar sertifikat (thumbnail + judul + penerbit + tahun); klik untuk melihat versi besar |
| F3 | Galeri | Foto pribadi, proyek, dan aktivitas; ada filter kategori dan lightbox |
| F4 | Proyek | Kartu proyek: judul, deskripsi singkat, tech/skill, tautan demo/repo |
| F5 | Animasi skill | Logo skill mengambang di hero/section skill |
| F6 | Unduh CV | Tombol yang langsung mengunduh `cv.pdf` |
| F7 | Info kontak | Section kontak: email, nomor WhatsApp, lokasi (opsional), media sosial |
| F8 | CTA | Tombol "Chat WhatsApp" dan "Kirim Email" di hero, section kontak, dan footer |
| F9 | Dua bahasa | Switch Indonesia / English di navbar; seluruh teks ikut berganti |

**Struktur section (final):** Hero → Tentang → Pengalaman & Pendidikan → Skill → Proyek → Sertifikat → Galeri → Kontak → Footer.

## Tech Stack

| Kebutuhan | Pilihan | Alasan |
|---|---|---|
| Build tool | Vite + React 18 + TypeScript | Ringan, cepat, output statis |
| Styling | Tailwind CSS 3 | Cepat membuat desain minimalis konsisten |
| Animasi | Framer Motion | Animasi mengambang dan transisi section yang halus |
| Ikon skill | `react-icons` (Simple Icons) | Logo teknologi siap pakai |
| Lightbox | Komponen sendiri (`ImageLightbox`) | Aksesibel (Esc, jebakan fokus, panah, fokus kembali) tanpa dependency tambahan; dipakai sertifikat dan galeri |
| i18n | Context + kamus bertipe buatan sendiri (tanpa library) | Hanya 2 bahasa; situs kecil dan statis |
| Font | Inter + Plus Jakarta Sans (self-hosted via `@fontsource`) | Tampilan modern dan cepat dimuat |
| Test | Vitest, React Testing Library, Playwright, axe-core, Lighthouse CI | Unit, komponen, E2E, aksesibilitas, performa |
| Hosting | Vercel paket gratis (alternatif: Netlify / GitHub Pages) | Gratis, HTTPS otomatis |

Versi dependency dipin saat inisialisasi proyek dan dicatat di `package.json`.

## Commands

```bash
# Inisialisasi (sekali)
npm create vite@latest portfolio -- --template react-ts
cd portfolio && npm install

# Harian
Dev:        npm run dev
Build:      npm run build
Preview:    npm run preview
Lint:       npm run lint -- --fix
Format:     npm run format
Typecheck:  npm run typecheck          # tsc --noEmit

# Test
Unit:       npm test                    # vitest run
Coverage:   npm test -- --coverage
E2E:        npx playwright test
Perf/a11y:  npx lhci autorun            # Lighthouse CI
```

## Project Structure

```
portfolio/
├── SPEC.md                  → Dokumen ini
├── public/
│   ├── cv.pdf               → CV yang diunduh pengunjung
│   ├── favicon.svg
│   ├── og-image.png         → Preview saat tautan dibagikan
│   ├── certificates/        → <id>-thumb.webp, <id>-full.webp, <id>.pdf
│   └── gallery/             → Foto galeri (WebP)
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── layout/          → Navbar, Footer
│   │   ├── sections/        → Hero, About, Skills, Projects, Certificates, Gallery, Contact
│   │   └── ui/              → Button, Card, ImageLightbox, Reveal, FloatingIcon, LanguageSwitch
│   ├── data/                → Konten terpisah dari tampilan
│   │   ├── profile.ts       → Nama, bio, kontak, tautan sosial
│   │   ├── experience.ts / education.ts
│   │   ├── skills.ts
│   │   ├── projects.ts
│   │   ├── certificates.ts
│   │   └── gallery.ts
│   ├── assets/
│   │   └── profile-*.webp   → Foto profil (WebP, 2 ukuran)
│   ├── i18n/                → LanguageProvider, useLang, tipe Localized<T>
│   ├── lib/                 → Helper (mis. buildWhatsAppUrl)
│   └── styles/index.css     → Tailwind + design tokens
├── tests/                   → Unit & komponen
├── e2e/                     → Playwright
└── docs/                    → Catatan deploy & cara mengganti konten
```

Prinsip: **semua konten diedit lewat `src/data/*.ts`**, tanpa menyentuh komponen. Setiap teks berbentuk `{ id: string, en: string }`.

## Code Style

- TypeScript `strict: true`; komponen fungsional; satu komponen per file; nama file `PascalCase.tsx`.
- Nama variabel `camelCase`, konstanta `UPPER_SNAKE_CASE`, tipe `PascalCase`.
- Kelas Tailwind dipakai langsung; warna dan spacing lewat design tokens (CSS variables), bukan nilai hardcode.
- Setiap `<img>` wajib punya `alt` bermakna dan `width`/`height`; gambar di bawah fold memakai `loading="lazy"`.

Contoh gaya:

```tsx
// src/components/ui/FloatingIcon.tsx
import { motion, useReducedMotion } from "framer-motion";
import type { IconType } from "react-icons";

type FloatingIconProps = {
  icon: IconType;
  label: string;
  delay?: number;
};

export function FloatingIcon({ icon: Icon, label, delay = 0 }: FloatingIconProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-label={label}
      role="img"
      className="grid h-14 w-14 place-items-center rounded-2xl bg-surface shadow-soft"
      animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
      transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <Icon className="h-7 w-7 text-ink" aria-hidden />
    </motion.div>
  );
}
```

```ts
// src/lib/contact.ts
export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
```

**Arah visual:** palet netral (putih gading / abu hangat + satu warna aksen), banyak ruang kosong, tipografi besar dan tegas, sudut membulat, bayangan lembut, transisi scroll halus dan tidak berlebihan.

## Testing Strategy

| Level | Tool | Cakupan |
|---|---|---|
| Unit | Vitest | `buildWhatsAppUrl`, validasi data (`data/*.ts` tidak boleh kosong/duplikat), kelengkapan terjemahan (tiap teks punya `id` dan `en`), filter galeri |
| Komponen | React Testing Library | Lightbox sertifikat terbuka/tutup, filter galeri, tombol CTA punya `href` yang benar |
| E2E | Playwright (Chromium + WebKit, viewport 375px & 1280px) | Semua section tampil, klik unduh CV memicu download, CTA WA/email benar, navigasi anchor |
| Non-fungsional | Lighthouse CI | Performance, Accessibility, SEO, Best Practices |

Target cakupan unit/komponen: ≥ 80% untuk `src/lib` dan `src/components/ui`. Test ditulis bersama fiturnya; tidak ada test yang dihapus agar build hijau tanpa persetujuan.

## Boundaries

**Always:**
- Jalankan `typecheck`, `lint`, dan `test` sebelum commit.
- Simpan konten di `src/data/`, bukan di dalam komponen.
- Kompres gambar ke WebP (lebar maks 1600px untuk galeri/sertifikat) dan sediakan `alt`.
- Hormati `prefers-reduced-motion` untuk semua animasi.
- Pastikan tampilan nyaman di mobile (diuji di 375px).

**Ask first:**
- Menambah dependency baru di luar tech stack di atas.
- Menambah form kontak, backend, atau layanan pihak ketiga (analytics, dll.).
- Menampilkan data sensitif (nomor telepon lengkap, alamat rumah, foto keluarga).
- Mengganti hosting atau domain.

**Never:**
- Commit secret, token, atau data pribadi yang belum disetujui pemilik.
- Memakai gambar/sertifikat/logo tanpa hak pakai atau tanpa persetujuan pemilik.
- Menghapus atau melewati test yang gagal tanpa persetujuan.
- Memasang animasi yang memblokir konten atau membuat halaman terasa lambat.

## Success Criteria

| Fitur | Kriteria yang bisa diuji |
|---|---|
| F1 Desain | Tampil benar tanpa horizontal scroll di 375px, 768px, 1280px; kontras teks ≥ WCAG AA; animasi berhenti saat `prefers-reduced-motion: reduce` |
| F2 Sertifikat | Setiap sertifikat di `certificates.ts` tampil sebagai kartu; klik membuka tampilan besar yang bisa ditutup (Esc / tombol / klik luar) |
| F3 Galeri | Foto tampil dalam grid; filter kategori (Pribadi / Proyek / Aktivitas) bekerja; lightbox bisa next/prev dengan keyboard |
| F4 Proyek | Setiap proyek menampilkan judul, deskripsi, skill, dan minimal satu tautan yang valid |
| F5 Animasi | Minimal 6 ikon skill mengambang halus (loop) di hero/section skill tanpa layout shift |
| F6 Unduh CV | Klik tombol mengunduh `cv.pdf` (diverifikasi E2E); tombol tersedia di hero dan section kontak |
| F7 Kontak | Email, nomor WhatsApp, dan tautan sosial tampil dan benar |
| F8 CTA | Tombol WhatsApp membuka `wa.me/6281284945531?text=...` dengan pesan awal sesuai bahasa; tombol email membuka `mailto:avalentinocp@gmail.com` dengan subjek terisi |
| F9 Dua bahasa | Switch ID/EN mengganti seluruh teks tanpa reload; pilihan tersimpan setelah refresh; `<html lang>` ikut berubah; tidak ada teks yang tertinggal di bahasa lain |
| Performa | Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95; LCP < 2.5 dtk; CLS < 0.1 |
| SEO/Share | `<title>`, meta description, dan Open Graph image terisi; pratinjau tautan tampil baik saat dibagikan |
| Deploy | Situs live di URL publik dengan HTTPS dan bisa dibuka tanpa login |

## Data Konten (dari CV dan file unggahan)

| Item | Nilai |
|---|---|
| Nama | Amrullah Valentino Caesar Putra |
| Peran | Software Engineer · Google AI Professional (fresh graduate S1 Teknik Informatika, Universitas Mercu Buana) |
| Email | avalentinocp@gmail.com |
| WhatsApp | 081284945531 (tautan `wa.me/6281284945531`) |
| GitHub | github.com/AISHTERN |
| Lokasi | Jakarta, Indonesia |
| Foto | `foto_formal.jpeg` (hero / tentang) |
| Pengalaman | IT Hardware & Deployment Specialist (PT Global Alfa Solusindo, freelance 6 bln); IT Support & Web Specialist (PT Bogajaya Sukses Abadi); Full Stack Developer Intern (CV. Credibug Partner Solutions) |
| Pendidikan | S1 Teknik Informatika, Universitas Mercu Buana (2022–2026); SMKN 56 Jakarta, TKJ (2019–2022) |
| Proyek | Virtual Assistant Chatbot 3D (React Three Fiber / Three.js + AI); Oh My Cake, e-commerce toko kue (Laravel + MySQL) |
| Sertifikat (ada file) | Google AI Professional Certificate (11 Sep 2026); Introduction to Front-End Development, Meta (12 Sep 2026); CCNAv7: Introduction to Networks, Cisco (1 Agu 2023) |
| Sertifikat (belum ada file) | Sertifikasi Software Engineer BNSP |
| Skill (ikon mengambang) | Laravel, PHP, JavaScript, Vue.js, React, Python, HTML5, CSS3, MySQL, PostgreSQL, Git, GitHub, Figma, Postman, Three.js |

## Keputusan dan Pertanyaan Terbuka

**Diputuskan (default yang dipakai):**

| Topik | Keputusan |
|---|---|
| Sertifikat BNSP | Belum ditampilkan sampai berkasnya ada; panduan di `docs/UPDATING_CONTENT.md` |
| Tautan proyek | Kartu tampil tanpa tombol tautan; tombol muncul otomatis saat `links` diisi |
| CV bahasa Inggris | CV disimpan per bahasa; mode English memakai CV Indonesia sampai `cv-en.pdf` tersedia |
| Media sosial | Hanya GitHub (sesuai CV) |
| Subdomain | `amrullah-valentino.vercel.app` (diubah lewat `VITE_SITE_URL`) |
| Bahasa awal | Mengikuti bahasa browser (Indonesia bila bahasa pertama `id`, selain itu English) |
| Aset sertifikat/galeri | Di `public/` (bukan `src/assets/`) agar menambah berkas tidak perlu mengubah kode |

**Masih butuh tindakan pemilik:**

1. Membaca dan menyetujui terjemahan Inggris.
2. Memastikan klaim sertifikasi BNSP di paragraf "Tentang Saya" dan menyediakan berkasnya.
3. Memberikan foto galeri, tautan proyek, dan (bila ada) CV Inggris atau media sosial lain.
4. Menjalankan `npm install`, seluruh pemeriksaan di `docs/VERIFICATION.md`, lalu deploy (`docs/DEPLOY.md`).
