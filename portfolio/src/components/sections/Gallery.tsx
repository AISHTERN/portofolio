import { useState } from "react";
import { GALLERY, galleryImageUrl, type GalleryItem } from "../../data/gallery";
import { useLang } from "../../i18n/context";
import { availableCategories, filterGallery, type GalleryFilter } from "../../lib/gallery";
import { ImageLightbox, type LightboxImage } from "../ui/ImageLightbox";
import { ImageIcon } from "../ui/icons";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

const RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

type GalleryProps = {
  /** Bisa diganti untuk pengujian; bawaannya data/gallery.ts. */
  items?: readonly GalleryItem[];
};

export function Gallery({ items = GALLERY }: GalleryProps) {
  const { t } = useLang();
  const [filter, setFilter] = useState<GalleryFilter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = filterGallery(items, filter);
  const categories = availableCategories(items);

  const images: LightboxImage[] = visible.map((item) => ({
    src: galleryImageUrl(item.file),
    alt: t(item.alt),
    caption: item.caption ? t(item.caption) : undefined,
  }));

  const chooseFilter = (next: GalleryFilter) => {
    setFilter(next);
    setOpenIndex(null);
  };

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-title"
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <Reveal>
        <SectionHeading
          id="gallery-title"
          eyebrow={t({ id: "Momen", en: "Moments" })}
          title={t({ id: "Galeri", en: "Gallery" })}
          description={t({
            id: "Foto pribadi, proyek, dan aktivitas.",
            en: "Personal photos, projects, and activities.",
          })}
        />
      </Reveal>

      {items.length === 0 ? (
        <Reveal className="mt-12">
          <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-line bg-surface px-6 py-16 text-center">
            <span
              aria-hidden="true"
              className="grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent"
            >
              <ImageIcon />
            </span>
            <p className="font-display text-xl font-semibold text-ink">
              {t({ id: "Galeri segera hadir", en: "Gallery coming soon" })}
            </p>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              {t({
                id: "Foto pribadi, proyek, dan aktivitas akan ditambahkan di sini.",
                en: "Personal, project, and activity photos will be added here.",
              })}
            </p>
          </div>
        </Reveal>
      ) : (
        <>
          <div
            role="group"
            aria-label={t({ id: "Filter kategori", en: "Filter by category" })}
            className="mt-10 flex flex-wrap gap-2"
          >
            {[{ id: "all" as const, label: { id: "Semua", en: "All" } }, ...categories].map(
              (option) => {
                const active = filter === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => chooseFilter(option.id)}
                    className={[
                      "h-10 rounded-full border px-4 text-sm font-semibold transition-colors",
                      RING,
                      active
                        ? "border-accent bg-accent text-white"
                        : "border-line bg-surface text-muted hover:text-ink",
                    ].join(" ")}
                  >
                    {t(option.label)}
                  </button>
                );
              },
            )}
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  className={`group block aspect-[4/3] w-full overflow-hidden rounded-card border border-line bg-canvas shadow-soft ${RING}`}
                >
                  <img
                    src={galleryImageUrl(item.file)}
                    alt={t(item.alt)}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </button>
              </li>
            ))}
          </ul>

          <ImageLightbox
            images={images}
            index={openIndex}
            onClose={() => setOpenIndex(null)}
            onIndexChange={setOpenIndex}
          />
        </>
      )}
    </section>
  );
}
