import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Certificates } from "../src/components/sections/Certificates";
import { LanguageSwitch } from "../src/components/ui/LanguageSwitch";
import { CERTIFICATES, certificateAssets } from "../src/data/certificates";
import { LanguageProvider } from "../src/i18n/LanguageProvider";

function setup() {
  return render(
    <LanguageProvider>
      <LanguageSwitch />
      <Certificates />
    </LanguageProvider>,
  );
}

beforeEach(() => {
  vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["id-ID"]);
});

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.lang = "";
  document.body.style.overflow = "";
  vi.restoreAllMocks();
});

describe("Certificates section", () => {
  it("is the #certificates section, labelled by its heading", () => {
    const { container } = setup();

    expect(container.querySelector("section#certificates")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Sertifikat" })).toBeInTheDocument();
  });

  it("shows a card per certificate with title, issuer and formatted date", () => {
    setup();

    for (const c of CERTIFICATES) {
      expect(screen.getByRole("heading", { level: 3, name: c.title.id })).toBeInTheDocument();
    }
    expect(screen.getByText("11 Sep 2026")).toBeInTheDocument();
    expect(screen.getByText("12 Sep 2026")).toBeInTheDocument();
    expect(screen.getByText("1 Agu 2023")).toBeInTheDocument();
  });

  it("shows verification links only for certificates that have one, and a PDF link for all", () => {
    setup();
    const region = screen.getByRole("region", { name: "Sertifikat" });

    const verify = within(region).getAllByRole("link", { name: "Verifikasi" });
    expect(verify).toHaveLength(2);
    for (const link of verify) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }

    const pdf = within(region).getAllByRole("link", { name: "Buka PDF" });
    expect(pdf.map((l) => l.getAttribute("href"))).toEqual(
      CERTIFICATES.map((c) => certificateAssets(c.id).pdf),
    );
  });

  it("opens the full-size certificate in a lightbox and returns focus on close", async () => {
    const user = userEvent.setup();
    setup();

    const open = screen.getByRole("button", {
      name: "Lihat sertifikat Google AI Professional Certificate",
    });
    await user.click(open);

    const dialog = screen.getByRole("dialog", { name: "Pratinjau gambar" });
    expect(within(dialog).getByRole("img")).toHaveAttribute(
      "src",
      certificateAssets("google-ai").full,
    );

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(open).toHaveFocus();
  });

  it("lets you step through the other certificates inside the lightbox", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(
      screen.getByRole("button", { name: "Lihat sertifikat Google AI Professional Certificate" }),
    );
    await user.keyboard("{ArrowRight}");

    expect(within(screen.getByRole("dialog")).getByRole("img")).toHaveAttribute(
      "src",
      certificateAssets("meta-frontend").full,
    );
  });

  it("switches labels and dates to English", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByRole("region", { name: "Certificates" })).toBeInTheDocument();
    expect(screen.getByText("Sep 11, 2026")).toBeInTheDocument();
    expect(screen.getByText("Aug 1, 2023")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Verify" })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Open PDF" })).toHaveLength(3);
  });
});
