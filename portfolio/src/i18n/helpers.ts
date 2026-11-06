import type { Localized } from "./types";

/** Teks yang sama di kedua bahasa (nama perusahaan, istilah teknis, dan sejenisnya). */
export const same = (text: string): Localized => ({ id: text, en: text });
