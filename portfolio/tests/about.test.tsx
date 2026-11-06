import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { About } from "../src/components/sections/About";
import { LanguageSwitch } from "../src/components/ui/LanguageSwitch";
import { ABOUT_FACTS, ABOUT_PARAGRAPHS } from "../src/data/about";
import { LanguageProvider } from "../src/i18n/LanguageProvider";

function setup() {
  return render(
    <LanguageProvider>
      <LanguageSwitch />
      <About />
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

describe("About section", () => {
  it("is the #about section, labelled by its heading", () => {
    const { container } = setup();

    expect(container.querySelector("section#about")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Tentang Saya" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Tentang Saya" })).toBeInTheDocument();
  });

  it("shows every paragraph in Indonesian", () => {
    setup();

    for (const paragraph of ABOUT_PARAGRAPHS) {
      expect(screen.getByText(paragraph.id)).toBeInTheDocument();
    }
  });

  it("shows the quick facts as a description list", () => {
    setup();
    const region = screen.getByRole("region", { name: "Tentang Saya" });

    for (const fact of ABOUT_FACTS) {
      const term = within(region).getByText(fact.label.id);
      expect(term.tagName).toBe("DT");
      expect(term.nextElementSibling).toHaveTextContent(fact.value.id);
      expect(term.nextElementSibling?.tagName).toBe("DD");
    }
  });

  it("switches heading, paragraphs and facts to English", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByRole("heading", { level: 2, name: "About Me" })).toBeInTheDocument();
    for (const paragraph of ABOUT_PARAGRAPHS) {
      expect(screen.getByText(paragraph.en)).toBeInTheDocument();
      expect(screen.queryByText(paragraph.id)).not.toBeInTheDocument();
    }
    for (const fact of ABOUT_FACTS) {
      expect(screen.getByText(fact.label.en)).toBeInTheDocument();
    }
  });
});
