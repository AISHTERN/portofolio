import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { ImageLightbox, type LightboxImage } from "../src/components/ui/ImageLightbox";
import { LanguageSwitch } from "../src/components/ui/LanguageSwitch";
import { LanguageProvider } from "../src/i18n/LanguageProvider";

const IMAGES: LightboxImage[] = [
  { src: "/a.webp", alt: "Gambar A", caption: "Keterangan A" },
  {
    src: "/b.webp",
    alt: "Gambar B",
    caption: "Keterangan B",
    links: [{ label: "Verifikasi", href: "https://example.com/verify" }],
  },
  { src: "/c.webp", alt: "Gambar C" },
];

function Harness({ images = IMAGES, start = 1 }: { images?: LightboxImage[]; start?: number | null }) {
  const [index, setIndex] = useState<number | null>(start);
  return (
    <LanguageProvider>
      <LanguageSwitch />
      <button type="button" onClick={() => setIndex(0)}>
        buka
      </button>
      <ImageLightbox
        images={images}
        index={index}
        onClose={() => setIndex(null)}
        onIndexChange={setIndex}
      />
    </LanguageProvider>
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

describe("ImageLightbox", () => {
  it("renders nothing while closed", () => {
    render(<Harness start={null} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("is a labelled modal dialog showing the chosen image, caption and counter", () => {
    render(<Harness />);

    const dialog = screen.getByRole("dialog", { name: "Pratinjau gambar" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("img", { name: "Gambar B" })).toHaveAttribute("src", "/b.webp");
    expect(screen.getByText("Keterangan B")).toBeInTheDocument();
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("shows extra links safely in a new tab", () => {
    render(<Harness />);

    const link = screen.getByRole("link", { name: "Verifikasi" });
    expect(link).toHaveAttribute("href", "https://example.com/verify");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("moves focus to the close button on open", () => {
    render(<Harness />);

    expect(screen.getByRole("button", { name: "Tutup" })).toHaveFocus();
  });

  it("closes with Escape, the close button and a backdrop click, but not an inside click", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole("img", { name: "Gambar B" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "buka" }));
    await user.click(screen.getByRole("button", { name: "Tutup" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "buka" }));
    await user.click(screen.getByRole("dialog").parentElement!);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("returns focus to the element that opened it", async () => {
    const user = userEvent.setup();
    render(<Harness start={null} />);

    const opener = screen.getByRole("button", { name: "buka" });
    await user.click(opener);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(opener).toHaveFocus();
  });

  it("locks page scroll while open and restores it afterwards", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    expect(document.body.style.overflow).toBe("");
  });

  it("goes to the next and previous image with the arrow keys and wraps around", async () => {
    const user = userEvent.setup();
    render(<Harness start={2} />);

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("img", { name: "Gambar A" })).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("img", { name: "Gambar C" })).toBeInTheDocument();
  });

  it("has previous and next buttons when there are several images", async () => {
    const user = userEvent.setup();
    render(<Harness start={0} />);

    await user.click(screen.getByRole("button", { name: "Berikutnya" }));
    expect(screen.getByRole("img", { name: "Gambar B" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sebelumnya" }));
    expect(screen.getByRole("img", { name: "Gambar A" })).toBeInTheDocument();
  });

  it("hides navigation and the counter for a single image", async () => {
    const user = userEvent.setup();
    render(<Harness images={[IMAGES[0]]} start={0} />);

    expect(screen.queryByRole("button", { name: "Berikutnya" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Sebelumnya" })).not.toBeInTheDocument();
    expect(screen.queryByText(/\/ 1/)).not.toBeInTheDocument();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("img", { name: "Gambar A" })).toBeInTheDocument();
  });

  it("keeps Tab focus inside the dialog", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const dialog = screen.getByRole("dialog");

    for (let i = 0; i < 8; i++) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
    await user.tab({ shift: true });
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it("uses English labels after switching language", async () => {
    const user = userEvent.setup();
    render(<Harness start={null} />);
    await user.click(screen.getByRole("button", { name: "English" }));
    await user.click(screen.getByRole("button", { name: "buka" }));

    expect(screen.getByRole("dialog", { name: "Image preview" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
  });
});
