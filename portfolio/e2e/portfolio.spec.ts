import { expect, test, type Page } from "@playwright/test";

/**
 * Alur utama portofolio. Test bertanda @layout memeriksa tata letak dan animasi nyata,
 * jadi hanya bermakna terhadap build produksi (CSS Tailwind dan framer-motion asli).
 */

const SECTION_IDS = [
  "home",
  "about",
  "experience",
  "skills",
  "projects",
  "certificates",
  "gallery",
  "contact",
];
const WA = "https://wa.me/6281284945531";
const MESSAGE = {
  id: "Halo, saya melihat portofolio Anda dan ingin berdiskusi.",
  en: "Hi, I came across your portfolio and would like to get in touch.",
};
const CV_FILE = "CV_Amrullah_Valentino_Caesar_Putra.pdf";

const viewportWidth = (page: Page) => page.viewportSize()?.width ?? 1280;
const isMobile = (page: Page) => viewportWidth(page) < 768;

async function openMenuIfNeeded(page: Page) {
  const toggle = page.getByRole("button", { name: /^(Buka|Open) menu$/ });
  if (await toggle.isVisible()) await toggle.click();
}

/** Opasitas efektif = hasil kali opasitas elemen dan semua induknya (Reveal memakai opacity pada pembungkus). */
const effectiveOpacity = (page: Page, selector: string) =>
  page.evaluate((sel) => {
    let value = 1;
    for (let node = document.querySelector(sel); node; node = node.parentElement) {
      value *= parseFloat(getComputedStyle(node).opacity);
    }
    return value;
  }, selector);

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test.describe("structure and navigation", () => {
  test("renders every section in navigation order", async ({ page }) => {
    const ids = await page.locator("main > section").evaluateAll((els) => els.map((el) => el.id));
    expect(ids).toEqual(SECTION_IDS);
  });

  test("has an h1 and a skip link as the first Tab stop", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Amrullah Valentino Caesar Putra");

    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Lewati ke konten", exact: true });
    await expect(skip).toBeFocused();
    await expect(skip).toHaveAttribute("href", "#main");
  });

  test("navigation links scroll to their section", async ({ page }) => {
    await openMenuIfNeeded(page);
    await page.getByRole("link", { name: "Proyek", exact: true }).click();

    await expect(page).toHaveURL(/#projects$/);
    await expect(page.locator("#projects")).toBeInViewport();
  });
});

test.describe("contact actions", () => {
  test("WhatsApp opens wa.me in a new tab with the opening message", async ({ page, context }) => {
    await context.route("https://wa.me/**", (route) =>
      route.fulfill({ status: 200, contentType: "text/html", body: "ok" }),
    );
    const link = page.locator("#home").getByRole("link", { name: "Chat WhatsApp", exact: true });
    await expect(link).toHaveAttribute("href", `${WA}?text=${encodeURIComponent(MESSAGE.id)}`);

    const [popup] = await Promise.all([context.waitForEvent("page"), link.click()]);
    await popup.waitForLoadState();

    expect(popup.url()).toBe(`${WA}?text=${encodeURIComponent(MESSAGE.id)}`);
    expect(await popup.evaluate(() => window.opener)).toBeNull();
  });

  test("email link has the address and subject", async ({ page }) => {
    await expect(
      page.locator("#home").getByRole("link", { name: "Kirim Email", exact: true }),
    ).toHaveAttribute(
      "href",
      `mailto:avalentinocp@gmail.com?subject=${encodeURIComponent("Menghubungi dari portofolio Anda")}`,
    );
  });

  test("the CV downloads from both the hero and the contact section", async ({ page }) => {
    for (const scope of ["#home", "#contact"]) {
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        page.locator(scope).getByRole("link", { name: "Unduh CV", exact: true }).click(),
      ]);
      expect(download.suggestedFilename()).toBe(CV_FILE);
    }
  });

  test("the footer repeats the contact shortcuts with identical targets", async ({ page }) => {
    const footer = page.getByRole("contentinfo").getByRole("navigation", { name: "Tautan kontak" });
    await expect(footer.getByRole("link", { name: "WhatsApp", exact: true })).toHaveAttribute(
      "href",
      `${WA}?text=${encodeURIComponent(MESSAGE.id)}`,
    );
    await expect(footer.getByRole("link", { name: "GitHub", exact: true })).toHaveAttribute(
      "href",
      "https://github.com/AISHTERN",
    );
  });
});

test.describe("language switch", () => {
  test("changes text, <html lang>, title and links, and survives a reload", async ({ page }) => {
    await page.getByRole("button", { name: "English", exact: true }).click();

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("region", { name: "Skills", exact: true })).toBeVisible();
    await expect(
      page.locator("#home").getByRole("link", { name: "Chat on WhatsApp", exact: true }),
    ).toHaveAttribute("href", `${WA}?text=${encodeURIComponent(MESSAGE.en)}`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /^Portfolio of Amrullah/,
    );

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("region", { name: "Skills", exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Bahasa Indonesia", exact: true }).click();
    await expect(page.getByRole("region", { name: "Skill", exact: true })).toBeVisible();
  });
});

test.describe("certificates", () => {
  test("shows three certificates whose images load", async ({ page }) => {
    const cards = page.locator("#certificates article");
    await expect(cards).toHaveCount(3);

    await page.locator("#certificates").scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        page.locator("#certificates article img").evaluateAll((imgs) =>
          imgs.every((img) => (img as HTMLImageElement).naturalWidth > 0),
        ),
      )
      .toBe(true);
  });

  test("the lightbox opens, steps, wraps, closes and restores focus", async ({ page }) => {
    const opener = page.getByRole("button", {
      name: "Lihat sertifikat Google AI Professional Certificate",
      exact: true,
    });
    await opener.scrollIntoViewIfNeeded();
    await opener.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog", { name: "Pratinjau gambar" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("1 / 3")).toBeVisible();
    await expect(dialog.getByRole("img")).toHaveAttribute("src", /google-ai-full\.webp$/);

    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByRole("img")).toHaveAttribute("src", /meta-frontend-full\.webp$/);
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(dialog.getByRole("img")).toHaveAttribute("src", /cisco-ccna-itn-full\.webp$/);

    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
      expect(await page.evaluate(() => !!document.activeElement?.closest("[role=dialog]"))).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test("verification links exist only where the certificate has one", async ({ page }) => {
    await expect(
      page.locator("#certificates").getByRole("link", { name: "Verifikasi", exact: true }),
    ).toHaveCount(2);
    await expect(
      page.locator("#certificates").getByRole("link", { name: "Buka PDF", exact: true }),
    ).toHaveCount(3);
  });
});

test.describe("content", () => {
  test("lists the CV projects, experience and skills", async ({ page }) => {
    await expect(page.locator("#projects h3")).toHaveText(["Virtual Assistant Chatbot 3D", "Oh My Cake"]);
    await expect(page.locator("#experience h4")).toHaveCount(5);
    await expect(page.locator("#skills li")).toHaveCount(30);
  });

  test("the gallery shows a friendly empty state until photos are added", async ({ page }) => {
    await expect(page.getByText("Galeri segera hadir", { exact: true })).toBeVisible();
  });
});

test.describe("hero portrait", () => {
  test("its reserved width/height match the real image ratio (prevents layout shift)", async ({ page }) => {
    const photo = page.locator("#home img").first();
    await expect
      .poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
      .toBe(true);

    const { reserved, actual } = await photo.evaluate((img: HTMLImageElement) => ({
      reserved: Number(img.getAttribute("width")) / Number(img.getAttribute("height")),
      actual: img.naturalWidth / img.naturalHeight,
    }));
    expect(Math.abs(reserved - actual)).toBeLessThan(0.005);
  });
});

test.describe("reliability", () => {
  test("loads and scrolls the whole page without console errors or failed requests", async ({ page }) => {
    const problems: string[] = [];
    page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") problems.push(`console: ${message.text()}`);
    });
    page.on("requestfailed", (request) => problems.push(`failed: ${request.url()}`));

    await page.reload();
    for (const id of SECTION_IDS) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    }

    expect(problems).toEqual([]);
  });

  test("reduced motion: icons are static and content is shown immediately", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();

    const names = await page
      .getByRole("group", { name: "Teknologi yang saya gunakan" })
      .getByRole("img")
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).animationName));
    expect(names).toHaveLength(8);
    expect(names.every((name) => name === "none")).toBe(true);

    expect(await effectiveOpacity(page, "#about h2")).toBeGreaterThan(0.99);
  });
});

test.describe("layout and motion @layout", () => {
  test("@layout the page never scrolls sideways, even after visiting every section", async ({ page }) => {
    for (const id of SECTION_IDS) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("@layout navigation adapts: menu button on mobile, inline links on desktop", async ({ page }) => {
    const toggle = page.getByRole("button", { name: /^(Buka|Open) menu$/ });
    const link = page.getByRole("navigation", { name: "Navigasi utama" }).getByRole("link", {
      name: "Tentang",
      exact: true,
    });

    if (isMobile(page)) {
      await expect(toggle).toBeVisible();
      await expect(link).toBeHidden();
      await toggle.click();
      await expect(link).toBeVisible();
    } else {
      await expect(toggle).toBeHidden();
      await expect(link).toBeVisible();
    }
  });

  test("@layout the floating icons stay fully inside the viewport and do not cover the CTAs", async ({ page }) => {
    const width = viewportWidth(page);
    const icons = page.getByRole("group", { name: "Teknologi yang saya gunakan" }).getByRole("img");
    const boxes = await icons.evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
      }),
    );
    for (const box of boxes) {
      expect(box.left).toBeGreaterThanOrEqual(0);
      expect(box.right).toBeLessThanOrEqual(width);
    }

    const buttons = await page
      .locator("#home")
      .getByRole("link", { name: /WhatsApp|Email|CV/ })
      .evaluateAll((els) =>
        els.map((el) => {
          const r = el.getBoundingClientRect();
          return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
        }),
      );
    for (const icon of boxes) {
      for (const button of buttons) {
        const overlaps =
          icon.left < button.right &&
          icon.right > button.left &&
          icon.top < button.bottom &&
          icon.bottom > button.top;
        expect(overlaps).toBe(false);
      }
    }
  });

  test("@layout the lightbox overlay covers the whole viewport", async ({ page }) => {
    const opener = page.getByRole("button", {
      name: "Lihat sertifikat Google AI Professional Certificate",
      exact: true,
    });
    await opener.scrollIntoViewIfNeeded();
    await opener.click();

    const overlay = page.getByRole("dialog").locator("xpath=..");
    const box = await overlay.boundingBox();
    const viewport = page.viewportSize()!;
    expect(box).toMatchObject({ x: 0, y: 0, width: viewport.width, height: viewport.height });
  });

  test("@layout sections fade in once they are scrolled into view", async ({ page }) => {
    for (const id of SECTION_IDS.slice(1)) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect.poll(() => effectiveOpacity(page, `#${id} h2`)).toBeGreaterThan(0.99);
    }
  });

  test("@layout the portrait fits its column and keeps its aspect ratio", async ({ page }) => {
    const photo = page.locator("#home img").first();
    const box = await photo.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(viewportWidth(page));
    expect(box!.height / box!.width).toBeCloseTo(1067 / 800, 1);
  });
});
