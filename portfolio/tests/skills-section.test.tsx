import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Skills } from "../src/components/sections/Skills";
import { LanguageSwitch } from "../src/components/ui/LanguageSwitch";
import { SKILL_CATEGORIES } from "../src/data/skills";
import { LanguageProvider } from "../src/i18n/LanguageProvider";

function setup() {
  return render(
    <LanguageProvider>
      <LanguageSwitch />
      <Skills />
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

describe("Skills section", () => {
  it("is the #skills section, labelled by its heading", () => {
    const { container } = setup();

    expect(container.querySelector("section#skills")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Skill" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Skill" })).toBeInTheDocument();
  });

  it("shows every category from the CV with its Indonesian title", () => {
    setup();

    for (const category of SKILL_CATEGORIES) {
      expect(
        screen.getByRole("heading", { level: 3, name: category.title.id }),
      ).toBeInTheDocument();
    }
  });

  it("lists every skill of every category", () => {
    setup();
    const region = screen.getByRole("region", { name: "Skill" });

    for (const category of SKILL_CATEGORIES) {
      for (const skill of category.skills) {
        expect(within(region).getByText(skill.label.id)).toBeInTheDocument();
      }
    }
  });

  it("shows a logo next to technologies that have one", () => {
    setup();

    const chip = screen.getByText("Laravel").closest("li")!;
    expect(chip.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("shows text-only chips for skills without a logo", () => {
    setup();

    const chip = screen.getByText("Prompt Engineering").closest("li")!;
    expect(chip.querySelector("svg")).toBeNull();
  });

  it("translates headings, categories and skill names to English", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByRole("heading", { level: 2, name: "Skills" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Programming & Web" }),
    ).toBeInTheDocument();
    expect(screen.getByText("SEO Optimization")).toBeInTheDocument();
    expect(screen.queryByText("Optimasi SEO")).not.toBeInTheDocument();
  });
});
