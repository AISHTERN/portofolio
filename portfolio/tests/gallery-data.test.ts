import { GALLERY, GALLERY_CATEGORIES } from "../src/data/gallery";
import { availableCategories, filterGallery } from "../src/lib/gallery";
import type { GalleryItem } from "../src/data/gallery";

const FIXTURE: GalleryItem[] = [
  { id: "a", file: "a.webp", category: "personal", alt: { id: "A", en: "A" } },
  { id: "b", file: "b.webp", category: "activity", alt: { id: "B", en: "B" } },
  { id: "c", file: "c.webp", category: "personal", alt: { id: "C", en: "C" } },
  { id: "d", file: "d.webp", category: "project", alt: { id: "D", en: "D" } },
];

describe("gallery categories", () => {
  it("has the three categories from the spec with labels in both languages", () => {
    expect(GALLERY_CATEGORIES.map((c) => c.id)).toEqual(["personal", "project", "activity"]);
    for (const category of GALLERY_CATEGORIES) {
      expect(category.label.id.trim()).not.toBe("");
      expect(category.label.en.trim()).not.toBe("");
    }
  });
});

describe("gallery data (applies to every photo added later)", () => {
  it("has unique ids and a bare file name", () => {
    expect(new Set(GALLERY.map((item) => item.id)).size).toBe(GALLERY.length);
    for (const item of GALLERY) {
      expect(item.file).toMatch(/^[\w.-]+\.(webp|jpe?g|png|avif)$/i);
    }
  });

  it("gives every photo alt text in both languages and a valid category", () => {
    const valid = GALLERY_CATEGORIES.map((c) => c.id as string);
    for (const item of GALLERY) {
      expect(item.alt.id.trim()).not.toBe("");
      expect(item.alt.en.trim()).not.toBe("");
      expect(valid).toContain(item.category);
    }
  });
});

describe("filterGallery", () => {
  it("returns everything for 'all'", () => {
    expect(filterGallery(FIXTURE, "all").map((i) => i.id)).toEqual(["a", "b", "c", "d"]);
  });

  it("returns only the chosen category, keeping order", () => {
    expect(filterGallery(FIXTURE, "personal").map((i) => i.id)).toEqual(["a", "c"]);
    expect(filterGallery(FIXTURE, "project").map((i) => i.id)).toEqual(["d"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterGallery(FIXTURE.slice(0, 1), "activity")).toEqual([]);
  });
});

describe("availableCategories", () => {
  it("lists only categories that have photos, in the canonical order", () => {
    expect(availableCategories(FIXTURE).map((c) => c.id)).toEqual(["personal", "project", "activity"]);
    expect(availableCategories([FIXTURE[3]]).map((c) => c.id)).toEqual(["project"]);
  });

  it("is empty for an empty gallery", () => {
    expect(availableCategories([])).toEqual([]);
  });
});
