import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Experience } from "../src/components/sections/Experience";
import { LanguageSwitch } from "../src/components/ui/LanguageSwitch";
import { EDUCATION } from "../src/data/education";
import { EXPERIENCES } from "../src/data/experience";
import { LanguageProvider } from "../src/i18n/LanguageProvider";

function setup() {
  return render(
    <LanguageProvider>
      <LanguageSwitch />
      <Experience />
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

describe("Experience section", () => {
  it("is the #experience section, labelled by its heading", () => {
    const { container } = setup();

    expect(container.querySelector("section#experience")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Pengalaman" })).toBeInTheDocument();
  });

  it("has two named timelines: work experience and education", () => {
    setup();

    expect(screen.getByRole("list", { name: "Pengalaman Kerja" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Pendidikan" })).toBeInTheDocument();
  });

  it("lists the three positions in CV order with role and company", () => {
    setup();
    const work = screen.getByRole("list", { name: "Pengalaman Kerja" });

    const items = within(work).getAllByRole("listitem");
    expect(items).toHaveLength(EXPERIENCES.length);

    EXPERIENCES.forEach((experience, index) => {
      const item = items[index];
      expect(within(item).getByRole("heading", { level: 4 })).toHaveTextContent(
        experience.role.id,
      );
      expect(within(item).getByText(experience.company)).toBeInTheDocument();
    });
  });

  it("shows every highlight of every position", () => {
    setup();

    for (const experience of EXPERIENCES) {
      for (const highlight of experience.highlights) {
        expect(screen.getByText(highlight.id)).toBeInTheDocument();
      }
    }
  });

  it("shows the freelance duration and the internship label", () => {
    setup();

    expect(screen.getByText("Freelance · 6 bulan")).toBeInTheDocument();
    expect(screen.getByText("Magang")).toBeInTheDocument();
  });

  it("lists both schools with program, years and the pending diploma note", () => {
    setup();
    const education = screen.getByRole("list", { name: "Pendidikan" });

    const items = within(education).getAllByRole("listitem");
    expect(items).toHaveLength(EDUCATION.length);

    EDUCATION.forEach((entry, index) => {
      const item = items[index];
      expect(within(item).getByRole("heading", { level: 4 })).toHaveTextContent(entry.program.id);
      expect(within(item).getByText(entry.institution)).toBeInTheDocument();
      expect(within(item).getByText(entry.years)).toBeInTheDocument();
      if (entry.note) expect(within(item).getByText(entry.note.id)).toBeInTheDocument();
    });
  });

  it("switches everything to English", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByRole("region", { name: "Experience" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Work Experience" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Education" })).toBeInTheDocument();
    for (const experience of EXPERIENCES) {
      for (const highlight of experience.highlights) {
        expect(screen.getByText(highlight.en)).toBeInTheDocument();
        expect(screen.queryByText(highlight.id)).not.toBeInTheDocument();
      }
    }
    expect(screen.getByText("Freelance · 6 months")).toBeInTheDocument();
    expect(screen.getByText("Internship")).toBeInTheDocument();
  });
});
