import type { Localized } from "../i18n/types";

type Profile = {
  name: string;
  role: string;
  email: string;
  /** Format lokal atau internasional; dikonversi oleh lib/contact. */
  phone: string;
  phoneDisplay: string;
  github: { handle: string; url: string };
  location: Localized;
  summary: Localized;
  availability: Localized;
  photoAlt: Localized;
  whatsappMessage: Localized;
  emailSubject: Localized;
  /** CV per bahasa. Saat ini keduanya Indonesia; lihat docs/UPDATING_CONTENT.md untuk menambah CV Inggris. */
  cv: Localized<{ href: string; fileName: string }>;
};

// BASE_URL menjaga tautan tetap benar bila situs di-host di sub-path.
const CV_ID = {
  href: `${import.meta.env.BASE_URL}cv.pdf`,
  fileName: "CV_Amrullah_Valentino_Caesar_Putra.pdf",
};
// CV berbahasa Inggris belum ada, jadi mode English memakai CV Indonesia.
// Setelah ada: taruh di public/cv-en.pdf lalu ganti dengan
//   { href: `${import.meta.env.BASE_URL}cv-en.pdf`, fileName: "CV_Amrullah_Valentino_Caesar_Putra_EN.pdf" }
const CV_EN = CV_ID;

export const PROFILE: Profile = {
  name: "Amrullah Valentino Caesar Putra",
  role: "Software Engineer · Google AI Professional",
  email: "avalentinocp@gmail.com",
  phone: "081284945531",
  phoneDisplay: "0812-8494-5531",
  github: { handle: "AISHTERN", url: "https://github.com/AISHTERN" },
  location: { id: "Jakarta, Indonesia", en: "Jakarta, Indonesia" },
  summary: {
    id: "Lulusan baru S1 Teknik Informatika Universitas Mercu Buana dengan keahlian pengembangan web Full Stack, optimasi SEO, integrasi AI, dan infrastruktur IT.",
    en: "Recent Informatics Engineering graduate from Universitas Mercu Buana, skilled in full-stack web development, SEO optimization, AI integration, and IT infrastructure.",
  },
  availability: {
    id: "Terbuka untuk peluang full-time",
    en: "Open to full-time opportunities",
  },
  photoAlt: {
    id: "Foto formal Amrullah Valentino Caesar Putra berjas hitam dengan dasi merah",
    en: "Formal portrait of Amrullah Valentino Caesar Putra in a black suit and red tie",
  },
  whatsappMessage: {
    id: "Halo, saya melihat portofolio Anda dan ingin berdiskusi.",
    en: "Hi, I came across your portfolio and would like to get in touch.",
  },
  emailSubject: {
    id: "Menghubungi dari portofolio Anda",
    en: "Reaching out from your portfolio",
  },
  cv: { id: CV_ID, en: CV_EN },
};
