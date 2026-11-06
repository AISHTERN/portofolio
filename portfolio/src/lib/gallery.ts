import { GALLERY_CATEGORIES, type GalleryCategory, type GalleryItem } from "../data/gallery";

export type GalleryFilter = GalleryCategory | "all";

export function filterGallery(items: readonly GalleryItem[], filter: GalleryFilter): GalleryItem[] {
  return filter === "all" ? [...items] : items.filter((item) => item.category === filter);
}

/** Kategori yang punya foto, dengan urutan baku GALLERY_CATEGORIES. */
export function availableCategories(items: readonly GalleryItem[]) {
  const used = new Set(items.map((item) => item.category));
  return GALLERY_CATEGORIES.filter((category) => used.has(category.id));
}
