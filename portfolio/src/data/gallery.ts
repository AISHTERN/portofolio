import { publicUrl } from "../lib/publicUrl";
import type { Localized } from "../i18n/types";

export type GalleryCategory = "personal" | "project" | "activity";

export const GALLERY_CATEGORIES: readonly { id: GalleryCategory; label: Localized }[] = [
  { id: "personal", label: { id: "Pribadi", en: "Personal" } },
  { id: "project", label: { id: "Proyek", en: "Projects" } },
  { id: "activity", label: { id: "Aktivitas", en: "Activities" } },
];

export type GalleryItem = {
  id: string;
  /** Nama berkas di public/gallery/ (mis. "wisuda.webp"), tanpa folder. */
  file: string;
  alt: Localized;
  caption?: Localized;
  category: GalleryCategory;
};

export const galleryImageUrl = (file: string) => publicUrl(`gallery/${file}`);

/**
 * Foto menyusul. Cara menambah: taruh berkas di public/gallery/ lalu tambahkan
 * satu entri di sini, mis.:
 *
 *   {
 *     id: "wisuda",
 *     file: "wisuda.webp",
 *     category: "personal",
 *     alt: { id: "Foto wisuda", en: "Graduation photo" },
 *     caption: { id: "Hari wisuda", en: "Graduation day" },
 *   },
 */
export const GALLERY: readonly GalleryItem[] = [];
