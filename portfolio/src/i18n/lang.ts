import { LANGS, type Lang } from "./types";

export const LANG_STORAGE_KEY = "portfolio-lang";

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as readonly string[]).includes(value);
}

/**
 * Pilihan tersimpan menang. Jika tidak ada, bahasa pertama browser menentukan:
 * "id" → Indonesia, selain itu → English. Tanpa info bahasa → Indonesia.
 */
export function detectInitialLang(
  stored: string | null,
  browserLanguages: readonly string[],
): Lang {
  if (isLang(stored)) return stored;

  const first = browserLanguages[0];
  if (!first) return "id";

  return first.toLowerCase().startsWith("id") ? "id" : "en";
}

export function getBrowserLanguages(): readonly string[] {
  if (typeof navigator === "undefined") return [];
  if (navigator.languages?.length) return navigator.languages;
  return navigator.language ? [navigator.language] : [];
}

/** localStorage bisa gagal (mode privat, diblokir). Selalu aman dipanggil. */
export function readStoredLang(): string | null {
  try {
    return window.localStorage.getItem(LANG_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function storeLang(lang: Lang): void {
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Abaikan: bahasa tetap berganti, hanya tidak diingat setelah refresh.
  }
}
