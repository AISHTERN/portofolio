import type { Lang } from "../i18n/types";

const LOCALES: Record<Lang, string> = { id: "id-ID", en: "en-US" };

/** "2026-09-11" → "11 Sep 2026" (id) atau "Sep 11, 2026" (en). UTC agar harinya tidak bergeser. */
export function formatDate(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALES[lang], {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
