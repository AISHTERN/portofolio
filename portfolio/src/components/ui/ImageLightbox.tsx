import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLang } from "../../i18n/context";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "./icons";

export type LightboxLink = { label: string; href: string };

export type LightboxImage = {
  src: string;
  alt: string;
  caption?: string;
  links?: readonly LightboxLink[];
};

type ImageLightboxProps = {
  images: readonly LightboxImage[];
  /** null = tertutup. */
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

const FOCUSABLE = "a[href], button:not([disabled])";
const RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const ICON_BUTTON = `grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-ink shadow-soft transition-colors hover:text-accent ${RING}`;

/**
 * Dialog pratinjau gambar yang aksesibel: Esc menutup, panah kiri/kanan berpindah,
 * fokus terjebak di dalam dialog dan kembali ke pemicu saat ditutup, scroll halaman dikunci.
 */
export function ImageLightbox({ images, index, onClose, onIndexChange }: ImageLightboxProps) {
  const { t } = useLang();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const image = index === null ? undefined : images[index];
  const open = image !== undefined;
  const count = images.length;

  // Kunci scroll + fokus awal; pulihkan keduanya saat ditutup.
  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      trigger?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open || index === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (count > 1 && event.key === "ArrowRight") {
        onIndexChange((index + 1) % count);
      } else if (count > 1 && event.key === "ArrowLeft") {
        onIndexChange((index - 1 + count) % count);
      } else if (event.key === "Tab") {
        const dialog = dialogRef.current;
        const focusable = dialog ? Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
        if (!dialog || focusable.length === 0) {
          event.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;

        if (!dialog.contains(active)) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, index, count, onClose, onIndexChange]);

  if (!image || index === null) return null;

  const step = (delta: number) => onIndexChange((index + delta + count) % count);

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t({ id: "Pratinjau gambar", en: "Image preview" })}
        className="relative flex max-h-full w-full max-w-5xl flex-col gap-4 overflow-auto rounded-card bg-surface p-4 shadow-soft sm:p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <p aria-live="polite" className="text-sm font-medium text-muted">
            {count > 1 ? `${index + 1} / ${count}` : ""}
          </p>
          <button
            ref={closeRef}
            type="button"
            aria-label={t({ id: "Tutup", en: "Close" })}
            onClick={onClose}
            className={ICON_BUTTON}
          >
            <CloseIcon />
          </button>
        </div>

        <figure className="flex flex-col items-center gap-3">
          <div className="flex w-full items-center justify-center gap-3">
            {count > 1 && (
              <button
                type="button"
                aria-label={t({ id: "Sebelumnya", en: "Previous" })}
                onClick={() => step(-1)}
                className={`${ICON_BUTTON} shrink-0`}
              >
                <ChevronLeftIcon />
              </button>
            )}
            <img
              src={image.src}
              alt={image.alt}
              className="max-h-[70vh] w-auto min-w-0 max-w-full object-contain"
            />
            {count > 1 && (
              <button
                type="button"
                aria-label={t({ id: "Berikutnya", en: "Next" })}
                onClick={() => step(1)}
                className={`${ICON_BUTTON} shrink-0`}
              >
                <ChevronRightIcon />
              </button>
            )}
          </div>
          {image.caption && (
            <figcaption className="text-center text-sm text-muted">{image.caption}</figcaption>
          )}
        </figure>

        {image.links && image.links.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-4">
            {image.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-full px-3 py-1 text-sm font-semibold text-accent hover:underline ${RING}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body,
  );
}
