import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * Pemeriksaan aksesibilitas otomatis (axe-core) terhadap WCAG 2.0/2.1/2.2 level A dan AA.
 * reduced-motion dihidupkan agar animasi masuk (Reveal) tidak membuat penilaian kontras
 * bergantung pada waktu.
 */
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function openPage(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  // Gulir sekali agar gambar lazy termuat sebelum dipindai.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.evaluate(() => window.scrollTo(0, 0));
}

for (const language of ["id", "en"] as const) {
  test(`no axe violations on the whole page (${language})`, async ({ page }) => {
    await openPage(page);
    if (language === "en") await page.getByRole("button", { name: "English", exact: true }).click();

    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();

    expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
  });
}

test("no axe violations with the certificate lightbox open", async ({ page }) => {
  await openPage(page);
  const opener = page.getByRole("button", {
    name: "Lihat sertifikat Google AI Professional Certificate",
    exact: true,
  });
  await opener.scrollIntoViewIfNeeded();
  await opener.click();
  await expect(page.getByRole("dialog")).toBeVisible();

  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();

  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
