import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageSwitch } from "../src/components/ui/LanguageSwitch";
import { useLang } from "../src/i18n/context";
import { LANG_STORAGE_KEY, detectInitialLang } from "../src/i18n/lang";
import { LanguageProvider } from "../src/i18n/LanguageProvider";

function Probe() {
  const { t } = useLang();
  return <p data-testid="probe">{t({ id: "Halo", en: "Hello" })}</p>;
}

function setup() {
  return render(
    <LanguageProvider>
      <LanguageSwitch />
      <Probe />
    </LanguageProvider>,
  );
}

function setBrowserLanguages(languages: string[]) {
  vi.spyOn(window.navigator, "languages", "get").mockReturnValue(languages);
}

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.lang = "";
  vi.restoreAllMocks();
});

describe("detectInitialLang", () => {
  it("uses the stored choice when it is valid", () => {
    expect(detectInitialLang("en", ["id-ID"])).toBe("en");
    expect(detectInitialLang("id", ["en-US"])).toBe("id");
  });

  it("ignores an invalid stored value and falls back to the browser", () => {
    expect(detectInitialLang("fr", ["id-ID"])).toBe("id");
    expect(detectInitialLang(null, ["en-US"])).toBe("en");
  });

  it("picks Indonesian only when the browser's first language is Indonesian", () => {
    expect(detectInitialLang(null, ["id-ID", "en-US"])).toBe("id");
    expect(detectInitialLang(null, ["en-US", "id"])).toBe("en");
    expect(detectInitialLang(null, ["ja-JP"])).toBe("en");
  });

  it("defaults to Indonesian when the browser reports no language", () => {
    expect(detectInitialLang(null, [])).toBe("id");
  });
});

describe("LanguageProvider and LanguageSwitch", () => {
  it("starts in the browser's language", () => {
    setBrowserLanguages(["id-ID"]);
    setup();

    expect(screen.getByTestId("probe")).toHaveTextContent("Halo");
    expect(document.documentElement.lang).toBe("id");
  });

  it("switches text and <html lang> without a reload", async () => {
    setBrowserLanguages(["id-ID"]);
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "English" }));
    expect(screen.getByTestId("probe")).toHaveTextContent("Hello");
    expect(document.documentElement.lang).toBe("en");

    await user.click(screen.getByRole("button", { name: "Bahasa Indonesia" }));
    expect(screen.getByTestId("probe")).toHaveTextContent("Halo");
    expect(document.documentElement.lang).toBe("id");
  });

  it("remembers the choice after a refresh", async () => {
    setBrowserLanguages(["id-ID"]);
    const user = userEvent.setup();
    const first = setup();

    await user.click(screen.getByRole("button", { name: "English" }));
    expect(window.localStorage.getItem(LANG_STORAGE_KEY)).toBe("en");

    first.unmount();
    setup();
    expect(screen.getByTestId("probe")).toHaveTextContent("Hello");
  });

  it("keeps working when storage throws", async () => {
    setBrowserLanguages(["id-ID"]);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByTestId("probe")).toHaveTextContent("Hello");
  });

  it("marks the active language with aria-pressed", async () => {
    setBrowserLanguages(["id-ID"]);
    const user = userEvent.setup();
    setup();

    const id = screen.getByRole("button", { name: "Bahasa Indonesia" });
    const en = screen.getByRole("button", { name: "English" });
    expect(id).toHaveAttribute("aria-pressed", "true");
    expect(en).toHaveAttribute("aria-pressed", "false");

    await user.click(en);
    expect(id).toHaveAttribute("aria-pressed", "false");
    expect(en).toHaveAttribute("aria-pressed", "true");
  });

  it("can be operated with the keyboard", async () => {
    setBrowserLanguages(["id-ID"]);
    const user = userEvent.setup();
    setup();

    await user.tab(); // ID
    await user.tab(); // EN
    expect(screen.getByRole("button", { name: "English" })).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(screen.getByTestId("probe")).toHaveTextContent("Hello");
  });

  it("exposes the switch as a labelled group", () => {
    setup();

    expect(
      screen.getByRole("group", { name: "Bahasa / Language" }),
    ).toBeInTheDocument();
  });
});

describe("useLang", () => {
  it("throws a helpful error outside <LanguageProvider>", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Probe />)).toThrow(/LanguageProvider/);
  });
});
