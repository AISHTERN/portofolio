import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Gallery } from "../src/components/sections/Gallery";
import { LanguageSwitch } from "../src/components/ui/LanguageSwitch";
import type { GalleryItem } from "../src/data/gallery";
import { LanguageProvider } from "../src/i18n/LanguageProvider";

const ITEMS: GalleryItem[] = [
  {
    id: "wisuda",
    file: "wisuda.webp",
    category: "personal",
    alt: { id: "Foto wisuda", en: "Graduation photo" },
    caption: { id: "Hari wisuda", en: "Graduation day" },
  },
  { id: "tim", file: "tim.webp", category: "activity", alt: { id: "Kegiatan tim", en: "Team activity" } },
  { id: "kopi", file: "kopi.webp", category: "personal", alt: { id: "Ngopi santai", en: "Relaxed coffee" } },
  { id: "chatbot", file: "chatbot.webp", category: "project", alt: { id: "Tampilan chatbot", en: "Chatbot screen" } },
];

function setup(items: GalleryItem[]) {
  return render(
    <LanguageProvider>
      <LanguageSwitch />
      <Gallery items={items} />
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

describe("Gallery with no photos yet", () => {
  it("is the #gallery section with a friendly empty state", () => {
    const { container } = setup([]);

    expect(container.querySelector("section#gallery")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Galeri" })).toBeInTheDocument();
    expect(screen.getByText("Galeri segera hadir")).toBeInTheDocument();
  });

  it("shows no filters, photos or buttons other than the language switch", () => {
    setup([]);
    const region = screen.getByRole("region", { name: "Galeri" });

    expect(within(region).queryByRole("group")).not.toBeInTheDocument();
    expect(within(region).queryAllByRole("button")).toHaveLength(0);
    expect(within(region).queryAllByRole("img")).toHaveLength(0);
  });

  it("switches the empty state to English", async () => {
    const user = userEvent.setup();
    setup([]);

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByRole("region", { name: "Gallery" })).toBeInTheDocument();
    expect(screen.getByText("Gallery coming soon")).toBeInTheDocument();
  });
});

describe("Gallery with photos", () => {
  it("shows every photo as a button named by its alt text, loaded lazily", () => {
    setup(ITEMS);
    const region = screen.getByRole("region", { name: "Galeri" });

    for (const item of ITEMS) {
      const button = within(region).getByRole("button", { name: item.alt.id });
      const img = within(button).getByRole("img");
      expect(img).toHaveAttribute("src", `/gallery/${item.file}`);
      expect(img).toHaveAttribute("loading", "lazy");
    }
  });

  it("offers a filter for 'all' plus only the categories that have photos", () => {
    setup(ITEMS.filter((item) => item.category !== "activity"));
    const filters = screen.getByRole("group", { name: "Filter kategori" });

    expect(within(filters).getAllByRole("button").map((b) => b.textContent)).toEqual([
      "Semua",
      "Pribadi",
      "Proyek",
    ]);
  });

  it("filters by category and marks the active filter", async () => {
    const user = userEvent.setup();
    setup(ITEMS);
    const filters = screen.getByRole("group", { name: "Filter kategori" });

    expect(within(filters).getByRole("button", { name: "Semua" })).toHaveAttribute("aria-pressed", "true");

    await user.click(within(filters).getByRole("button", { name: "Pribadi" }));
    const region = screen.getByRole("region", { name: "Galeri" });
    expect(within(region).getByRole("button", { name: "Foto wisuda" })).toBeInTheDocument();
    expect(within(region).getByRole("button", { name: "Ngopi santai" })).toBeInTheDocument();
    expect(within(region).queryByRole("button", { name: "Kegiatan tim" })).not.toBeInTheDocument();
    expect(within(filters).getByRole("button", { name: "Pribadi" })).toHaveAttribute("aria-pressed", "true");
    expect(within(filters).getByRole("button", { name: "Semua" })).toHaveAttribute("aria-pressed", "false");

    await user.click(within(filters).getByRole("button", { name: "Semua" }));
    expect(within(region).getByRole("button", { name: "Kegiatan tim" })).toBeInTheDocument();
  });

  it("opens a lightbox on click, with caption and counter", async () => {
    const user = userEvent.setup();
    setup(ITEMS);

    await user.click(screen.getByRole("button", { name: "Foto wisuda" }));

    const dialog = screen.getByRole("dialog", { name: "Pratinjau gambar" });
    expect(within(dialog).getByRole("img", { name: "Foto wisuda" })).toHaveAttribute(
      "src",
      "/gallery/wisuda.webp",
    );
    expect(within(dialog).getByText("Hari wisuda")).toBeInTheDocument();
    expect(within(dialog).getByText("1 / 4")).toBeInTheDocument();
  });

  it("steps through only the filtered photos with the arrow keys", async () => {
    const user = userEvent.setup();
    setup(ITEMS);
    const filters = screen.getByRole("group", { name: "Filter kategori" });
    await user.click(within(filters).getByRole("button", { name: "Pribadi" }));

    await user.click(screen.getByRole("button", { name: "Foto wisuda" }));
    expect(screen.getByText("1 / 2")).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");
    expect(within(screen.getByRole("dialog")).getByRole("img", { name: "Ngopi santai" })).toBeInTheDocument();
    await user.keyboard("{ArrowRight}");
    expect(within(screen.getByRole("dialog")).getByRole("img", { name: "Foto wisuda" })).toBeInTheDocument();
  });

  it("closes the lightbox with Escape and returns focus to the photo", async () => {
    const user = userEvent.setup();
    setup(ITEMS);

    const photo = screen.getByRole("button", { name: "Kegiatan tim" });
    await user.click(photo);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(photo).toHaveFocus();
  });

  it("switches filters, alt text and captions to English", async () => {
    const user = userEvent.setup();
    setup(ITEMS);

    await user.click(screen.getByRole("button", { name: "English" }));

    const filters = screen.getByRole("group", { name: "Filter by category" });
    expect(within(filters).getAllByRole("button").map((b) => b.textContent)).toEqual([
      "All",
      "Personal",
      "Projects",
      "Activities",
    ]);
    expect(screen.getByRole("button", { name: "Graduation photo" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Graduation photo" }));
    expect(screen.getByText("Graduation day")).toBeInTheDocument();
  });
});
