import { expect, test } from "@playwright/test";

/** Metadata yang dilihat mesin pencari dan pratinjau tautan, diperiksa pada build produksi. */

test.describe("head metadata", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has a title, description, canonical and Open Graph tags with absolute URLs", async ({ page }) => {
    await expect(page).toHaveTitle("Amrullah Valentino Caesar Putra · Software Engineer");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Software Engineer/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https?:\/\/[^/]+\/$/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https?:\/\/.+\/og-image\.png$/);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", /^https?:\/\/[^/]+\/$/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    expect(await page.content()).not.toContain("%VITE_SITE_URL%");
  });

  test("serves the share image, icons, robots.txt and sitemap.xml", async ({ page, request }) => {
    const ogPath = new URL(
      (await page.locator('meta[property="og:image"]').getAttribute("content"))!,
    ).pathname;

    for (const [path, type] of [
      [ogPath, "image/png"],
      ["/apple-touch-icon.png", "image/png"],
      ["/favicon.svg", "image/svg+xml"],
      ["/robots.txt", "text/plain"],
      ["/sitemap.xml", "xml"],
    ] as const) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
      expect(response.headers()["content-type"], path).toContain(type);
    }

    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/);
  });

  test("has valid JSON-LD for the person", async ({ page }) => {
    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(raw ?? "{}");

    expect(data["@type"]).toBe("Person");
    expect(data.name).toBe("Amrullah Valentino Caesar Putra");
    expect(data.sameAs).toContain("https://github.com/AISHTERN");
  });

  test("switching to English updates the description for crawlers that run JavaScript", async ({ page }) => {
    await page.getByRole("button", { name: "English", exact: true }).click();

    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /^Portfolio of Amrullah/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", /^Portfolio of Amrullah/);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("still shows the name, role and email", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("noscript h1")).toHaveText("Amrullah Valentino Caesar Putra");
    await expect(page.locator('noscript a[href^="mailto:"]')).toHaveAttribute(
      "href",
      "mailto:avalentinocp@gmail.com",
    );
  });
});
