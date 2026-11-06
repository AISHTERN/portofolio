import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageSwitch } from "../src/components/ui/LanguageSwitch";
import { useDocumentMeta } from "../src/hooks/useDocumentMeta";
import { LanguageProvider } from "../src/i18n/LanguageProvider";
import { SEO } from "../src/lib/seo";

function Probe() {
  useDocumentMeta();
  return null;
}

function setup() {
  return render(
    <LanguageProvider>
      <LanguageSwitch />
      <Probe />
    </LanguageProvider>,
  );
}

const meta = (selector: string) => document.head.querySelector(selector)?.getAttribute("content");

beforeEach(() => {
  vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["id-ID"]);
  document.head.innerHTML = `
    <meta name="description" content="stale" />
    <meta property="og:description" content="stale" />`;
  document.title = "stale";
});

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.lang = "";
  document.head.innerHTML = "";
  vi.restoreAllMocks();
});

describe("useDocumentMeta", () => {
  it("sets the title and descriptions in the active language", () => {
    setup();

    expect(document.title).toBe(SEO.title.id);
    expect(meta('meta[name="description"]')).toBe(SEO.description.id);
    expect(meta('meta[property="og:description"]')).toBe(SEO.description.id);
  });

  it("updates them when the language is switched", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(document.title).toBe(SEO.title.en);
    expect(meta('meta[name="description"]')).toBe(SEO.description.en);
    expect(meta('meta[property="og:description"]')).toBe(SEO.description.en);
    expect(meta('meta[name="twitter:description"]')).toBe(SEO.description.en);
  });

  it("creates a tag when the page does not have it yet", () => {
    setup();

    expect(meta('meta[property="og:title"]')).toBe(SEO.title.id);
    expect(meta('meta[name="twitter:title"]')).toBe(SEO.title.id);
  });
});
