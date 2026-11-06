import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Contact } from "../src/components/sections/Contact";
import { LanguageSwitch } from "../src/components/ui/LanguageSwitch";
import { PROFILE } from "../src/data/profile";
import { LanguageProvider } from "../src/i18n/LanguageProvider";

function setup() {
  return render(
    <LanguageProvider>
      <LanguageSwitch />
      <Contact />
    </LanguageProvider>,
  );
}

const waUrl = (message: string) =>
  `https://wa.me/6281284945531?text=${encodeURIComponent(message)}`;
const mailUrl = (subject: string) =>
  `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}`;

beforeEach(() => {
  vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["id-ID"]);
});

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.lang = "";
  vi.restoreAllMocks();
});

describe("Contact section", () => {
  it("is the #contact section, labelled by its heading", () => {
    const { container } = setup();

    expect(container.querySelector("section#contact")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Kontak" })).toBeInTheDocument();
  });

  it("has WhatsApp and email call-to-action buttons with the same links as the hero", () => {
    setup();

    const whatsapp = screen.getByRole("link", { name: "Chat WhatsApp" });
    expect(whatsapp).toHaveAttribute("href", waUrl(PROFILE.whatsappMessage.id));
    expect(whatsapp).toHaveAttribute("target", "_blank");
    expect(whatsapp).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: "Kirim Email" })).toHaveAttribute(
      "href",
      mailUrl(PROFILE.emailSubject.id),
    );
  });

  it("offers the CV download here too", () => {
    setup();

    const cv = screen.getByRole("link", { name: "Unduh CV" });
    expect(cv).toHaveAttribute("href", PROFILE.cv.id.href);
    expect(cv).toHaveAttribute("download", PROFILE.cv.id.fileName);
  });

  it("lists email, WhatsApp number, GitHub and location", () => {
    setup();
    const region = screen.getByRole("region", { name: "Kontak" });

    expect(within(region).getByRole("link", { name: /avalentinocp@gmail\.com/ })).toHaveAttribute(
      "href",
      mailUrl(PROFILE.emailSubject.id),
    );
    expect(within(region).getByRole("link", { name: /0812-8494-5531/ })).toHaveAttribute(
      "href",
      waUrl(PROFILE.whatsappMessage.id),
    );
    const github = within(region).getByRole("link", { name: /github\.com\/AISHTERN/ });
    expect(github).toHaveAttribute("href", "https://github.com/AISHTERN");
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");
    expect(within(region).getByText("Jakarta, Indonesia")).toBeInTheDocument();
  });

  it("switches copy and messages to English", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByRole("region", { name: "Contact" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Chat on WhatsApp" })).toHaveAttribute(
      "href",
      waUrl(PROFILE.whatsappMessage.en),
    );
    expect(screen.getByRole("link", { name: "Send Email" })).toHaveAttribute(
      "href",
      mailUrl(PROFILE.emailSubject.en),
    );
    expect(screen.getByRole("link", { name: "Download CV" })).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
  });
});
