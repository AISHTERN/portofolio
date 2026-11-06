import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar } from "../src/components/layout/Navbar";
import { NAV_IDS } from "../src/data/navigation";
import { LanguageProvider } from "../src/i18n/LanguageProvider";

function setup() {
  return render(
    <LanguageProvider>
      <Navbar />
    </LanguageProvider>,
  );
}

function setBrowserLanguages(languages: string[]) {
  vi.spyOn(window.navigator, "languages", "get").mockReturnValue(languages);
}

beforeEach(() => setBrowserLanguages(["id-ID"]));

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.lang = "";
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("Navbar", () => {
  it("renders a labelled navigation landmark with a link to every section", () => {
    setup();

    const nav = screen.getByRole("navigation", { name: "Navigasi utama" });
    const expected: Record<string, string> = {
      about: "Tentang",
      experience: "Pengalaman",
      skills: "Skill",
      projects: "Proyek",
      certificates: "Sertifikat",
      gallery: "Galeri",
      contact: "Kontak",
    };

    for (const id of NAV_IDS) {
      expect(within(nav).getByRole("link", { name: expected[id] })).toHaveAttribute(
        "href",
        `#${id}`,
      );
    }
  });

  it("links the brand to the top of the page", () => {
    setup();

    expect(screen.getByRole("link", { name: "Amrullah Valentino, ke atas" })).toHaveAttribute(
      "href",
      "#home",
    );
  });

  it("changes every label when the language is switched", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "English" }));

    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(within(nav).getByRole("link", { name: "Projects" })).toBeInTheDocument();
    expect(within(nav).queryByRole("link", { name: "Proyek" })).not.toBeInTheDocument();
  });

  it("includes the language switch", () => {
    setup();

    expect(screen.getByRole("group", { name: "Bahasa / Language" })).toBeInTheDocument();
  });
});

describe("Navbar mobile menu", () => {
  it("opens and closes with the menu button", async () => {
    const user = userEvent.setup();
    setup();

    const open = screen.getByRole("button", { name: "Buka menu" });
    expect(open).toHaveAttribute("aria-expanded", "false");

    await user.click(open);
    const close = screen.getByRole("button", { name: "Tutup menu" });
    expect(close).toHaveAttribute("aria-expanded", "true");

    await user.click(close);
    expect(screen.getByRole("button", { name: "Buka menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("closes after choosing a link", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "Buka menu" }));
    await user.click(screen.getByRole("link", { name: "Proyek" }));

    expect(screen.getByRole("button", { name: "Buka menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("closes with the Escape key", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "Buka menu" }));
    await user.keyboard("{Escape}");

    expect(screen.getByRole("button", { name: "Buka menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("points aria-controls at the list of links", () => {
    setup();

    const button = screen.getByRole("button", { name: "Buka menu" });
    const listId = button.getAttribute("aria-controls");

    expect(listId).toBeTruthy();
    expect(document.getElementById(listId!)).toContainElement(
      screen.getByRole("link", { name: "Tentang" }),
    );
  });
});

describe("Navbar active section", () => {
  type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;

  function installObserver() {
    const original = globalThis.IntersectionObserver;
    const state: { callback: Callback | null; observed: Element[] } = {
      callback: null,
      observed: [],
    };

    class CapturingObserver {
      constructor(callback: Callback) {
        state.callback = callback;
      }
      observe(element: Element) {
        state.observed.push(element);
      }
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }

    vi.stubGlobal("IntersectionObserver", CapturingObserver);
    return { state, restore: () => vi.stubGlobal("IntersectionObserver", original) };
  }

  function addSections() {
    for (const id of NAV_IDS) {
      const section = document.createElement("section");
      section.id = id;
      document.body.appendChild(section);
    }
  }

  it("marks the link of the visible section with aria-current", () => {
    const { state, restore } = installObserver();
    try {
      addSections();
      setup();

      expect(state.observed.map((el) => el.id)).toEqual(NAV_IDS);

      const projects = document.getElementById("projects")!;
      act(() => state.callback!([{ isIntersecting: true, target: projects }]));

      expect(screen.getByRole("link", { name: "Proyek" })).toHaveAttribute(
        "aria-current",
        "location",
      );
      expect(screen.getByRole("link", { name: "Tentang" })).not.toHaveAttribute("aria-current");

      act(() => state.callback!([{ isIntersecting: false, target: projects }]));
      expect(screen.getByRole("link", { name: "Proyek" })).not.toHaveAttribute("aria-current");
    } finally {
      restore();
    }
  });
});
