import html from "../index.html?raw";
import { SEO } from "../src/lib/seo";

const SITE = "https://example.test";
const page = html.replaceAll("%VITE_SITE_URL%", SITE);

function content(selector: RegExp): string | undefined {
  return page.match(selector)?.[1];
}
const metaName = (name: string) =>
  content(new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`));
const metaProp = (prop: string) =>
  content(new RegExp(`<meta\\s+property="${prop}"\\s+content="([^"]*)"`));

describe("SEO copy", () => {
  it("has a short, identical title in both languages", () => {
    expect(SEO.title.id).toBe("Amrullah Valentino Caesar Putra · Software Engineer");
    expect(SEO.title.en).toBe(SEO.title.id);
    expect(SEO.title.id.length).toBeLessThanOrEqual(60);
  });

  it("has a 50-160 character description in each language, and they differ", () => {
    for (const lang of ["id", "en"] as const) {
      expect(SEO.description[lang].length).toBeGreaterThanOrEqual(50);
      expect(SEO.description[lang].length).toBeLessThanOrEqual(160);
    }
    expect(SEO.description.en).not.toBe(SEO.description.id);
  });
});

describe("index.html head (what crawlers and link previews see without JavaScript)", () => {
  it("declares the page language, viewport and theme color", () => {
    expect(page).toMatch(/<html lang="id">/);
    expect(metaName("viewport")).toContain("width=device-width");
    expect(metaName("theme-color")).toBe("#FAFAF7");
  });

  it("uses the same title and Indonesian description as the app", () => {
    expect(content(/<title>([^<]*)<\/title>/)).toBe(SEO.title.id);
    expect(metaName("description")).toBe(SEO.description.id);
  });

  it("has a canonical URL and Open Graph tags with absolute URLs", () => {
    expect(content(/<link rel="canonical" href="([^"]*)"/)).toBe(`${SITE}/`);
    expect(metaProp("og:type")).toBe("website");
    expect(metaProp("og:title")).toBe(SEO.title.id);
    expect(metaProp("og:description")).toBe(SEO.description.id);
    expect(metaProp("og:url")).toBe(`${SITE}/`);
    expect(metaProp("og:image")).toBe(`${SITE}/og-image.png`);
    expect(metaProp("og:image:width")).toBe("1200");
    expect(metaProp("og:image:height")).toBe("630");
    expect(metaProp("og:locale")).toBe("id_ID");
    expect(metaProp("og:locale:alternate")).toBe("en_US");
  });

  it("has a large-image Twitter card", () => {
    expect(metaName("twitter:card")).toBe("summary_large_image");
    expect(metaName("twitter:title")).toBe(SEO.title.id);
    expect(metaName("twitter:image")).toBe(`${SITE}/og-image.png`);
  });

  it("links the favicon and touch icon", () => {
    expect(page).toMatch(/<link rel="icon" href="\/favicon\.svg" type="image\/svg\+xml"/);
    expect(page).toMatch(/<link rel="apple-touch-icon" href="\/apple-touch-icon\.png"/);
  });

  it("has valid JSON-LD describing the person", () => {
    const raw = content(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    const data = JSON.parse(raw ?? "{}");

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("Person");
    expect(data.name).toBe("Amrullah Valentino Caesar Putra");
    expect(data.jobTitle).toBe("Software Engineer");
    expect(data.email).toBe("mailto:avalentinocp@gmail.com");
    expect(data.url).toBe(`${SITE}/`);
    expect(data.sameAs).toEqual(["https://github.com/AISHTERN"]);
    expect(data.alumniOf.name).toBe("Universitas Mercu Buana");
  });

  it("leaves no unresolved placeholder other than the site URL", () => {
    expect(html.match(/%[A-Z_]+%/g)?.every((token) => token === "%VITE_SITE_URL%")).toBe(true);
  });

  it("has a no-JavaScript fallback with the name, role and email", () => {
    const noscript = content(/<noscript>([\s\S]*?)<\/noscript>/) ?? "";

    expect(noscript).toContain("<h1>Amrullah Valentino Caesar Putra</h1>");
    expect(noscript).toContain("Software Engineer");
    expect(noscript).toContain("mailto:avalentinocp@gmail.com");
  });
});
