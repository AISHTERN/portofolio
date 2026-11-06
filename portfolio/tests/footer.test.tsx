import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Footer } from "../src/components/layout/Footer";
import { LanguageSwitch } from "../src/components/ui/LanguageSwitch";
import { PROFILE } from "../src/data/profile";
import { LanguageProvider } from "../src/i18n/LanguageProvider";

function setup() {
  return render(
    <LanguageProvider>
      <LanguageSwitch />
      <Footer />
    </LanguageProvider>,
  );
}

beforeEach(() => {
  vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["id-ID"]);
});

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.lang = "";
  vi.restoreAllMocks();
});

describe("Footer", () => {
  it("shows the copyright with the current year and the owner's name", () => {
    setup();

    const year = new Date().getFullYear();
    expect(screen.getByRole("contentinfo")).toHaveTextContent(
      `© ${year} Amrullah Valentino Caesar Putra`,
    );
  });

  it("has a back-to-top link in the active language", async () => {
    const user = userEvent.setup();
    setup();

    expect(screen.getByRole("link", { name: "Kembali ke atas" })).toHaveAttribute("href", "#home");

    await user.click(screen.getByRole("button", { name: "English" }));
    expect(screen.getByRole("link", { name: "Back to top" })).toHaveAttribute("href", "#home");
  });

  it("has short contact links with the same targets as the call-to-action buttons", () => {
    setup();
    const footer = screen.getByRole("contentinfo");
    const nav = within(footer).getByRole("navigation", { name: "Tautan kontak" });

    expect(within(nav).getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
      "href",
      `https://wa.me/6281284945531?text=${encodeURIComponent(PROFILE.whatsappMessage.id)}`,
    );
    expect(within(nav).getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      `mailto:${PROFILE.email}?subject=${encodeURIComponent(PROFILE.emailSubject.id)}`,
    );
    const github = within(nav).getByRole("link", { name: "GitHub" });
    expect(github).toHaveAttribute("href", PROFILE.github.url);
    expect(github).toHaveAttribute("target", "_blank");
  });

  it("follows the language for the contact message", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "English" }));

    const nav = within(screen.getByRole("contentinfo")).getByRole("navigation", {
      name: "Contact links",
    });
    expect(within(nav).getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
      "href",
      `https://wa.me/6281284945531?text=${encodeURIComponent(PROFILE.whatsappMessage.en)}`,
    );
  });
});
