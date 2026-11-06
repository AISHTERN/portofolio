import { useEffect, useState } from "react";
import { NAV_IDS, NAV_ITEMS } from "../../data/navigation";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useLang } from "../../i18n/context";
import { LanguageSwitch } from "../ui/LanguageSwitch";

const LIST_ID = "primary-nav-list";

export function Navbar() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const activeId = useActiveSection(NAV_IDS);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <a
          href="#home"
          aria-label={t({
            id: "Amrullah Valentino, ke atas",
            en: "Amrullah Valentino, back to top",
          })}
          className="rounded-full font-display text-lg font-bold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          AV<span className="text-accent">.</span>
        </a>

        <nav aria-label={t({ id: "Navigasi utama", en: "Main navigation" })}>
          <ul
            id={LIST_ID}
            className={[
              "absolute inset-x-0 top-16 flex-col gap-1 border-b border-line bg-canvas p-4 shadow-soft",
              "md:static md:flex md:flex-row md:gap-1 md:border-0 md:bg-transparent md:p-0 md:shadow-none",
              open ? "flex" : "hidden",
            ].join(" ")}
          >
            {NAV_ITEMS.map((item) => {
              const active = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={active ? "location" : undefined}
                    onClick={() => setOpen(false)}
                    className={[
                      "block rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                      active
                        ? "bg-accent-soft text-accent"
                        : "text-muted hover:text-ink",
                    ].join(" ")}
                  >
                    {t(item.label)}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitch />
          <button
            type="button"
            aria-expanded={open}
            aria-controls={LIST_ID}
            aria-label={
              open
                ? t({ id: "Tutup menu", en: "Close menu" })
                : t({ id: "Buka menu", en: "Open menu" })
            }
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
