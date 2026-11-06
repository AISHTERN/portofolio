import { useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import type { IconType } from "react-icons";

type FloatingIconProps = {
  icon?: IconType;
  /** Nama teknologi; dibaca screen reader dan jadi fallback teks bila tanpa logo. */
  label: string;
  /** Warna logo (hex). */
  color?: string;
  /** Detik. */
  delay?: number;
  duration?: number;
  /** Kelas posisi untuk pembungkus luar (jangan pakai translate di sini). */
  className?: string;
};

function initials(label: string): string {
  return label
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/**
 * Kartu ikon yang melayang pelan. Pembungkus luar mengatur posisi, kartu dalam
 * yang beranimasi, supaya transform animasi tidak menimpa posisi.
 * Animasi berupa CSS keyframes (.float-icon di index.css), dimatikan saat reduced-motion.
 */
export function FloatingIcon({
  icon: Icon,
  label,
  color,
  delay = 0,
  duration = 4,
  className,
}: FloatingIconProps) {
  const reduceMotion = useReducedMotion();

  const style = {
    "--float-delay": `${delay}s`,
    "--float-duration": `${duration}s`,
    color,
  } as CSSProperties;

  return (
    <div className={className}>
      <div
        role="img"
        aria-label={label}
        style={style}
        className={[
          reduceMotion ? "" : "float-icon",
          "grid h-12 w-12 place-items-center rounded-2xl border border-line bg-surface shadow-soft sm:h-14 sm:w-14",
        ]
          .join(" ")
          .trim()}
      >
        {Icon ? (
          <Icon aria-hidden="true" className="h-6 w-6 sm:h-7 sm:w-7" />
        ) : (
          <span aria-hidden="true" className="text-sm font-bold text-ink">
            {initials(label)}
          </span>
        )}
      </div>
    </div>
  );
}
