# Cara mengubah konten

Semua konten diedit lewat berkas di `src/data/` dan folder `public/`. Anda tidak perlu menyentuh komponen.
Setiap teks berbentuk `{ id: "...", en: "..." }` (Indonesia dan Inggris). Test akan gagal bila salah satunya kosong,
jadi tidak ada teks yang tertinggal di satu bahasa.

Setelah mengubah apa pun: `npm test` lalu `npm run dev` untuk melihat hasilnya.

---

## 1. Menambah foto galeri

Galeri sekarang menampilkan "Galeri segera hadir" karena `GALLERY` kosong. Begitu ada satu foto, filter kategori
dan lightbox muncul otomatis.

1. **Siapkan foto**: format WebP, lebar sekitar 1600px, usahakan di bawah 300 KB (mis. lewat squoosh.app).
   Beri nama sederhana tanpa spasi, mis. `wisuda.webp`.
2. **Taruh** berkasnya di `public/gallery/`.
3. **Tambahkan satu entri** di `src/data/gallery.ts`:

```ts
export const GALLERY: readonly GalleryItem[] = [
  {
    id: "wisuda",                 // unik
    file: "wisuda.webp",          // nama berkas di public/gallery/
    category: "personal",         // "personal" | "project" | "activity"
    alt: { id: "Foto wisuda di Universitas Mercu Buana", en: "Graduation photo at Universitas Mercu Buana" },
    caption: { id: "Hari wisuda", en: "Graduation day" },   // opsional
  },
];
```

- `alt` **wajib** dalam dua bahasa: ini dibaca pembaca layar dan muncul sebagai nama tombol foto.
- Tombol filter hanya menampilkan kategori yang punya foto.
- Foto ditampilkan terpotong rapi di grid (rasio 4:3), tetapi lightbox menampilkan foto utuh.

## 2. Menambah sertifikat (mis. BNSP)

Sertifikat BNSP tercantum di CV tetapi berkasnya belum ada. Cara menambahnya:

1. **Buat gambar dari PDF-nya** (butuh `pdftoppm` dari paket poppler: `brew install poppler` di macOS,
   `sudo apt install poppler-utils` di Linux/WSL):

   ```bash
   npm run certs -- /lokasi/sertifikat-bnsp.pdf bnsp-software-engineer
   ```

   Perintah ini membuat tiga berkas di `public/certificates/`:
   `bnsp-software-engineer-thumb.webp` (kartu), `bnsp-software-engineer-full.webp` (lightbox), dan salinan PDF-nya.
   Id hanya boleh huruf kecil, angka, dan tanda minus.

2. **Tambahkan satu entri** di `src/data/certificates.ts`:

```ts
{
  id: "bnsp-software-engineer",          // sama dengan id di langkah 1
  title: { id: "Sertifikasi Software Engineer BNSP", en: "BNSP Software Engineer Certification" },
  issuer: "BNSP",
  date: "2025-01-31",                    // ISO: tahun-bulan-tanggal
  description: { id: "…", en: "…" },
  // verifyUrl: "https://…",             // isi hanya bila ada tautan verifikasi resmi
},
```

Kartu tampil sesuai urutan di daftar. Jika sertifikat Anda berupa gambar (bukan PDF), buat sendiri dua versi WebP
(lebar 640px dan 1600px) dengan nama `<id>-thumb.webp` dan `<id>-full.webp`, dan tetap sertakan `<id>.pdf`
karena tautan "Buka PDF" selalu ditampilkan.

## 3. Menambah tautan proyek

Di `src/data/projects.ts`, isi `links` pada proyek yang bersangkutan:

```ts
links: { demo: "https://oh-my-cake.example.com", repo: "https://github.com/AISHTERN/oh-my-cake" },
```

Tombol "Lihat Demo" dan "Kode Sumber" muncul hanya untuk tautan yang diisi (harus `https://`). Kosongkan bila belum ada.
Untuk proyek baru, tambahkan satu objek di `PROJECTS` (id unik, deskripsi dua bahasa, daftar `tech`).

## 4. Mengganti CV, atau menambah CV bahasa Inggris

- **Mengganti CV Indonesia**: timpa `public/cv.pdf` dengan berkas baru (nama tetap).
- **Menambah CV Inggris**: taruh di `public/cv-en.pdf`, lalu di `src/data/profile.ts` ganti baris
  `const CV_EN = CV_ID;` menjadi:

```ts
const CV_EN = {
  href: `${import.meta.env.BASE_URL}cv-en.pdf`,
  fileName: "CV_Amrullah_Valentino_Caesar_Putra_EN.pdf",
};
```

Tombol "Download CV" pada mode English akan memakai berkas itu.

## 5. Mengubah kontak

Di `src/data/profile.ts`: `email`, `phone` (format `08…` atau `+62…`, otomatis diubah untuk WhatsApp),
`phoneDisplay` (tampilan di halaman), `github`, dan pesan awal WhatsApp/subjek email di `whatsappMessage` dan `emailSubject`.
Hero, section Kontak, dan Footer memakai sumber yang sama, jadi cukup diubah di satu tempat.

## 6. Mengubah foto profil

Foto di Hero berasal dari `src/assets/profile-800.webp` dan `profile-480.webp`. Untuk menggantinya, buat dua ukuran
dari foto baru (rasio potret), mis. dengan `sharp`:

```bash
node -e "
const sharp = require('sharp');
(async () => { for (const w of [480, 800]) {
  const i = await sharp('foto-baru.jpg').rotate().resize({ width: w }).webp({ quality: 82 }).toFile('src/assets/profile-' + w + '.webp');
  console.log(w, i.width + 'x' + i.height);
} })();"
```

Lalu sesuaikan `PHOTO_WIDTH` dan `PHOTO_HEIGHT` di `src/components/sections/Hero.tsx` dengan ukuran file 800px
(agar browser memesan ruang dan tidak terjadi layout shift), dan perbarui teks alternatif `photoAlt` di `profile.ts`.
Jalankan `npm run brand` agar gambar pratinjau tautan (`og-image.png`) ikut diperbarui.

## 7. Mengubah skill, pengalaman, pendidikan, dan teks

| Yang diubah | Berkas |
|---|---|
| Daftar skill dan logonya | `src/data/skills.ts` |
| Ikon yang melayang di Hero (maks. 10) | `src/data/floatingIcons.ts` |
| Pengalaman kerja | `src/data/experience.ts` |
| Pendidikan | `src/data/education.ts` |
| Paragraf "Tentang Saya" dan kartu fakta | `src/data/about.ts` |
| Judul dan deskripsi halaman (SEO) | `src/lib/seo.ts` **dan** `index.html` (harus sama; dijaga test) |
| Warna dan font | `src/styles/index.css` (token `--color-*`) |

Terjemahan Inggris pada berkas-berkas itu ditulis dari CV; silakan koreksi sesuai gaya Anda.

## 8. Mengubah URL situs

URL dipakai untuk canonical, Open Graph, sitemap, dan robots. Ubah di `.env`:

```
VITE_SITE_URL=https://nama-anda.vercel.app
```

Di Vercel, isi variabel yang sama di *Project → Settings → Environment Variables*, lalu deploy ulang.
Jalankan `npm run brand` agar domain tercetak benar di `og-image.png`.

## Daftar periksa sebelum dipublikasikan

- [ ] `npm run typecheck && npm run lint && npm test` hijau
- [ ] Teks Inggris sudah Anda baca dan setujui
- [ ] Paragraf "Tentang Saya" menyebut sertifikasi BNSP: pastikan benar dan sertakan berkasnya (langkah 2)
- [ ] Nomor WhatsApp dan email yang tampil memang boleh publik
- [ ] `VITE_SITE_URL` sudah URL final, dan `npm run brand` sudah dijalankan ulang
