import { useEffect } from "react";
import { useLang } from "../i18n/context";
import { SEO } from "../lib/seo";

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

/** Menyamakan <title> dan meta deskripsi (termasuk Open Graph / Twitter) dengan bahasa aktif. */
export function useDocumentMeta() {
  const { lang } = useLang();

  useEffect(() => {
    const title = SEO.title[lang];
    const description = SEO.description[lang];

    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
  }, [lang]);
}
