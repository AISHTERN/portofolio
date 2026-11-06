import { useLang } from "../../i18n/context";
import type { Lang } from "../../i18n/types";

const OPTIONS: { lang: Lang; label: string; name: string }[] = [
  { lang: "id", label: "ID", name: "Bahasa Indonesia" },
  { lang: "en", label: "EN", name: "English" },
];

export function LanguageSwitch() {
  const { lang, setLang } = useLang();

  return (
    <div
      role="group"
      aria-label="Bahasa / Language"
      className="inline-flex rounded-full border border-line bg-surface p-1 shadow-soft"
    >
      {OPTIONS.map((option) => {
        const active = lang === option.lang;
        return (
          <button
            key={option.lang}
            type="button"
            lang={option.lang}
            aria-label={option.name}
            aria-pressed={active}
            onClick={() => setLang(option.lang)}
            className={[
              "h-9 min-w-[3rem] rounded-full px-4 text-sm font-semibold transition-colors",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              active ? "bg-accent text-white" : "text-muted hover:text-ink",
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
