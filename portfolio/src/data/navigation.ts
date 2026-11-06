import type { Localized } from "../i18n/types";

export type NavItem = { id: string; label: Localized };

/** Urutan di sini = urutan section di halaman = urutan menu. */
export const NAV_ITEMS: readonly NavItem[] = [
  { id: "about", label: { id: "Tentang", en: "About" } },
  { id: "experience", label: { id: "Pengalaman", en: "Experience" } },
  { id: "skills", label: { id: "Skill", en: "Skills" } },
  { id: "projects", label: { id: "Proyek", en: "Projects" } },
  { id: "certificates", label: { id: "Sertifikat", en: "Certificates" } },
  { id: "gallery", label: { id: "Galeri", en: "Gallery" } },
  { id: "contact", label: { id: "Kontak", en: "Contact" } },
];

export const NAV_IDS: readonly string[] = NAV_ITEMS.map((item) => item.id);
