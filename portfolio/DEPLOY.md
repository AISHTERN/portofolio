# Deploy gratis ke Vercel

Langkah di bawah membutuhkan akun GitHub dan Vercel milik Anda (keduanya gratis).

## 1. Periksa secara lokal

```bash
npm install                 # juga membuat package-lock.json; simpan di repo
npm run typecheck && npm run lint && npm test
npm run audit:a11y
npm run build && npm run preview
npx playwright install chromium webkit
npm run e2e                 # termasuk test tata letak (@layout) dan axe
npm run lhci                # Lighthouse: performa, aksesibilitas, SEO
```

Buka `http://localhost:4173` dan periksa di lebar HP dan desktop, dalam bahasa Indonesia dan English.

## 2. Simpan ke GitHub

```bash
git init
git add .
git commit -m "Portfolio website"
git branch -M main
git remote add origin https://github.com/AISHTERN/portfolio.git
git push -u origin main
```

(Buat dulu repositori kosong `portfolio` di GitHub.) Pastikan `package-lock.json` ikut ter-commit;
workflow CI memakainya lewat `npm ci`.

## 3. Hubungkan ke Vercel

1. Masuk ke vercel.com dengan akun GitHub → **Add New… → Project** → pilih repositori `portfolio`.
2. Vercel mengenali Vite otomatis (`vercel.json` sudah berisi perintah build, folder `dist`, dan header cache/keamanan).
3. Di **Environment Variables** tambahkan `VITE_SITE_URL` dengan URL yang akan dipakai,
   mis. `https://amrullah-valentino.vercel.app` (nama bisa diubah di *Settings → Domains*).
4. Klik **Deploy**. Selesai: situs publik dengan HTTPS.

Setiap `git push` ke `main` otomatis men-deploy ulang; setiap pull request mendapat URL pratinjau sendiri.

## 4. Setelah URL final diketahui

1. Pastikan `VITE_SITE_URL` (di `.env` dan di Vercel) sama dengan URL final, lalu `npm run brand` dan commit `public/og-image.png`.
2. Deploy ulang, lalu jalankan Lighthouse pada URL live:
   `npx lhci autorun --collect.url=https://URL-ANDA --collect.startServerCommand=""`
3. Uji pratinjau tautan di WhatsApp/LinkedIn (tempel URL). Jika gambar lama masih tampil, gunakan
   Facebook Sharing Debugger atau LinkedIn Post Inspector untuk menyegarkan cache.
4. Daftarkan situs ke Google Search Console dan kirim `https://URL-ANDA/sitemap.xml` (opsional).

## Domain sendiri (opsional)

Vercel → *Settings → Domains* → tambahkan domain, ikuti petunjuk DNS, lalu ubah `VITE_SITE_URL` dan deploy ulang.

## Rollback

Vercel → *Deployments* → pilih deploy sebelumnya → **Promote to Production**.

## Hosting alternatif

- **Netlify**: perintah build `npm run build`, folder `dist`, set `VITE_SITE_URL` di environment.
- **GitHub Pages**: hosting di sub-path `/portfolio/` membutuhkan `base: "/portfolio/"` di `vite.config.ts`.
  Tautan aset dan CV sudah memakai `BASE_URL`, tetapi `index.html` dan header di `vercel.json` tidak berlaku di sana.

## Pemecahan masalah

| Gejala | Penyebab umum |
|---|---|
| Pratinjau tautan tanpa gambar | `VITE_SITE_URL` belum diisi/berbeda dengan URL live, atau cache perlu disegarkan |
| Tautan PDF atau gambar sertifikat 404 | nama berkas di `public/certificates/` tidak sama dengan `id` di `certificates.ts` |
| Foto galeri tidak muncul | berkas tidak ada di `public/gallery/` atau nama di `file` salah ketik |
| `npm ci` gagal di CI | `package-lock.json` belum ter-commit |
| Build gagal di `prebuild` | `VITE_SITE_URL` harus berbentuk `https://domain` tanpa path |
