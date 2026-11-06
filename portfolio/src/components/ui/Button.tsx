import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  /** Buka di tab baru (WhatsApp, situs lain). */
  external?: boolean;
  /** Nama file unduhan; bila diisi, tautan memicu download. */
  download?: string;
  icon?: ReactNode;
};

const VARIANTS = {
  primary: "bg-accent text-white shadow-soft hover:bg-accent/90",
  secondary:
    "border border-line bg-surface text-ink hover:border-accent hover:text-accent",
  ghost: "text-ink hover:text-accent",
} as const;

export function Button({
  href,
  children,
  variant = "primary",
  external = false,
  download,
  icon,
}: ButtonProps) {
  return (
    <a
      href={href}
      download={download}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={[
        "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        VARIANTS[variant],
      ].join(" ")}
    >
      {icon}
      {children}
    </a>
  );
}
