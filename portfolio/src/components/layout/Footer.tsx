import { PROFILE } from "../../data/profile";
import { useContactLinks } from "../../hooks/useContactLinks";
import { useLang } from "../../i18n/context";

const LINK =
  "rounded-full px-3 py-1 font-medium text-ink transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Footer() {
  const { t } = useLang();
  const links = useContactLinks();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted md:flex-row">
        <p>© {new Date().getFullYear()} Amrullah Valentino Caesar Putra</p>

        <nav aria-label={t({ id: "Tautan kontak", en: "Contact links" })}>
          <ul className="flex items-center gap-1">
            <li>
              <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className={LINK}>
                WhatsApp
              </a>
            </li>
            <li>
              <a href={links.email} className={LINK}>
                Email
              </a>
            </li>
            <li>
              <a href={PROFILE.github.url} target="_blank" rel="noopener noreferrer" className={LINK}>
                GitHub
              </a>
            </li>
          </ul>
        </nav>

        <a href="#home" className={LINK}>
          {t({ id: "Kembali ke atas", en: "Back to top" })}
        </a>
      </div>
    </footer>
  );
}
