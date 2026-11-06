export const LANGS = ["id", "en"] as const;

export type Lang = (typeof LANGS)[number];

/** Teks dua bahasa. Semua konten di src/data/*.ts memakai bentuk ini. */
export type Localized<T = string> = { id: T; en: T };
