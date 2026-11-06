import { same } from "../i18n/helpers";
import type { Localized } from "../i18n/types";

/**
 * Judul dan deskripsi halaman. Versi Indonesia juga tertulis statis di index.html
 * (untuk crawler dan pratinjau tautan tanpa JavaScript); tests/seo.test.ts menjaga keduanya sama.
 */
export const SEO: { title: Localized; description: Localized } = {
  title: same("Amrullah Valentino Caesar Putra · Software Engineer"),
  description: {
    id: "Portofolio Amrullah Valentino Caesar Putra, Software Engineer lulusan Teknik Informatika. Proyek web Full Stack, integrasi AI, SEO, sertifikat, dan kontak.",
    en: "Portfolio of Amrullah Valentino Caesar Putra, Software Engineer. Full-stack web projects, AI integration, SEO, certificates, and contact details.",
  },
};
