import { publicUrl } from "../lib/publicUrl";
import { same } from "../i18n/helpers";
import type { Localized } from "../i18n/types";

export type Certificate = {
  /** Nama dasar berkas di public/certificates/ (huruf kecil, angka, tanda minus). */
  id: string;
  title: Localized;
  issuer: string;
  /** Format ISO: 2026-09-11. */
  date: string;
  description: Localized;
  /** Hanya diisi bila sertifikat punya tautan verifikasi resmi. */
  verifyUrl?: string;
};

/**
 * Berkas yang dibutuhkan tiap sertifikat di public/certificates/:
 *   <id>-thumb.webp, <id>-full.webp, <id>.pdf
 * (dibuat dengan `npm run certs -- <berkas.pdf> <id>`).
 */
export function certificateAssets(id: string) {
  return {
    thumb: publicUrl(`certificates/${id}-thumb.webp`),
    full: publicUrl(`certificates/${id}-full.webp`),
    pdf: publicUrl(`certificates/${id}.pdf`),
  };
}

// Sumber: 3 berkas sertifikat yang diunggah. Sertifikasi BNSP ada di CV tetapi
// belum ada berkasnya; tambahkan entri baru di sini setelah berkas tersedia.
export const CERTIFICATES: readonly Certificate[] = [
  {
    id: "google-ai",
    title: same("Google AI Professional Certificate"),
    issuer: "Google · Coursera",
    date: "2026-09-11",
    description: {
      id: "Program profesional 8 kursus tentang penerapan AI untuk brainstorming, riset, komunikasi, pembuatan konten, analisis data, serta pembuatan dan deployment aplikasi.",
      en: "An 8-course professional program on applying AI to brainstorming, research, communication, content creation, data analysis, and app building and deployment.",
    },
    verifyUrl: "https://coursera.org/verify/professional-cert/A1LXK6XLZ3YS",
  },
  {
    id: "meta-frontend",
    title: same("Introduction to Front-End Development"),
    issuer: "Meta · Coursera",
    date: "2026-09-12",
    description: {
      id: "Kursus pengantar pengembangan front-end yang diselenggarakan Meta melalui Coursera.",
      en: "An introductory front-end development course by Meta, offered through Coursera.",
    },
    verifyUrl: "https://coursera.org/verify/QBNRZNRTYLBJ",
  },
  {
    id: "cisco-ccna-itn",
    title: same("CCNAv7: Introduction to Networks"),
    issuer: "Cisco Networking Academy",
    date: "2023-08-01",
    description: {
      id: "Kredensial tingkat siswa dari Cisco Networking Academy: konfigurasi switch dan router, pengalamatan IPv4/IPv6, dan troubleshooting jaringan kecil.",
      en: "A student-level credential from Cisco Networking Academy: configuring switches and routers, IPv4/IPv6 addressing, and troubleshooting small networks.",
    },
  },
];
