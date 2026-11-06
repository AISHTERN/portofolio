import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Hero } from "../src/components/sections/Hero";
import { LanguageSwitch } from "../src/components/ui/LanguageSwitch";
import { HERO_FLOATING_ICONS } from "../src/data/floatingIcons";
import { PROFILE } from "../src/data/profile";
import { getSkill } from "../src/data/skills";
import { LanguageProvider } from "../src/i18n/LanguageProvider";

function setup() {
  return render(
    <LanguageProvider>
      <LanguageSwitch />
      <Hero />
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

describe("Hero content", () => {
  it("is the #home section with the owner's name as the h1", () => {
    const { container } = setup();

    expect(container.querySelector("section#home")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: PROFILE.name }),
    ).toBeInTheDocument();
  });

  it("shows the role, summary and availability in Indonesian", () => {
    setup();

    expect(screen.getByText(PROFILE.role)).toBeInTheDocument();
    expect(screen.getByText(PROFILE.summary.id)).toBeInTheDocument();
    expect(screen.getByText(PROFILE.availability.id)).toBeInTheDocument();
  });

  it("switches the copy to English", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByText(PROFILE.summary.en)).toBeInTheDocument();
    expect(screen.getByText(PROFILE.availability.en)).toBeInTheDocument();
    expect(screen.queryByText(PROFILE.summary.id)).not.toBeInTheDocument();
  });
});

describe("Hero call-to-action buttons", () => {
  it("opens WhatsApp in a new tab with the Indonesian opening message", () => {
    setup();

    const link = screen.getByRole("link", { name: "Chat WhatsApp" });
    expect(link).toHaveAttribute(
      "href",
      `https://wa.me/6281284945531?text=${encodeURIComponent(PROFILE.whatsappMessage.id)}`,
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("opens the mail app with the Indonesian subject", () => {
    setup();

    expect(screen.getByRole("link", { name: "Kirim Email" })).toHaveAttribute(
      "href",
      `mailto:${PROFILE.email}?subject=${encodeURIComponent(PROFILE.emailSubject.id)}`,
    );
  });

  it("downloads the CV under a clean file name", () => {
    setup();

    const link = screen.getByRole("link", { name: "Unduh CV" });
    expect(link).toHaveAttribute("href", PROFILE.cv.id.href);
    expect(link).toHaveAttribute("download", PROFILE.cv.id.fileName);
  });

  it("uses English labels and messages after switching language", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByRole("link", { name: "Chat on WhatsApp" })).toHaveAttribute(
      "href",
      `https://wa.me/6281284945531?text=${encodeURIComponent(PROFILE.whatsappMessage.en)}`,
    );
    expect(screen.getByRole("link", { name: "Send Email" })).toHaveAttribute(
      "href",
      `mailto:${PROFILE.email}?subject=${encodeURIComponent(PROFILE.emailSubject.en)}`,
    );
    expect(screen.getByRole("link", { name: "Download CV" })).toHaveAttribute(
      "download",
      PROFILE.cv.en.fileName,
    );
  });
});

describe("Hero photo", () => {
  it("has meaningful alt text and reserved dimensions to avoid layout shift", () => {
    setup();

    const photo = screen.getByRole("img", { name: PROFILE.photoAlt.id });
    expect(Number(photo.getAttribute("width"))).toBeGreaterThan(0);
    expect(Number(photo.getAttribute("height"))).toBeGreaterThan(0);
  });

  it("is not lazy-loaded because it is above the fold", () => {
    setup();

    expect(screen.getByRole("img", { name: PROFILE.photoAlt.id })).not.toHaveAttribute(
      "loading",
      "lazy",
    );
  });

  it("offers two image sizes through srcset", () => {
    setup();

    const srcset = screen.getByRole("img", { name: PROFILE.photoAlt.id }).getAttribute("srcset");
    expect(srcset).toMatch(/480w/);
    expect(srcset).toMatch(/800w/);
  });

  it("changes its alt text with the language", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByRole("img", { name: PROFILE.photoAlt.en })).toBeInTheDocument();
  });
});

describe("Hero floating skill icons", () => {
  it("shows 6 to 10 labelled skill icons in a group", () => {
    setup();

    const group = screen.getByRole("group", { name: "Teknologi yang saya gunakan" });
    const icons = within(group).getAllByRole("img");

    expect(icons.length).toBeGreaterThanOrEqual(6);
    expect(icons.length).toBeLessThanOrEqual(10);
    expect(icons.length).toBe(HERO_FLOATING_ICONS.length);
    for (const icon of icons) {
      expect(icon).toHaveAccessibleName();
    }
  });

  it("names each icon after its skill", () => {
    setup();

    const group = screen.getByRole("group", { name: "Teknologi yang saya gunakan" });
    for (const spec of HERO_FLOATING_ICONS) {
      expect(
        within(group).getByRole("img", { name: getSkill(spec.skillId).label.id }),
      ).toBeInTheDocument();
    }
  });

  it("labels the group in English after switching language", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByRole("group", { name: "Technologies I use" })).toBeInTheDocument();
  });
});
