import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectCard } from "../src/components/ui/ProjectCard";
import { Projects } from "../src/components/sections/Projects";
import { LanguageSwitch } from "../src/components/ui/LanguageSwitch";
import { PROJECTS, type Project } from "../src/data/projects";
import { LanguageProvider } from "../src/i18n/LanguageProvider";

function wrap(ui: React.ReactNode) {
  return render(
    <LanguageProvider>
      <LanguageSwitch />
      {ui}
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

describe("Projects section", () => {
  it("is the #projects section, labelled by its heading", () => {
    const { container } = wrap(<Projects />);

    expect(container.querySelector("section#projects")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Proyek" })).toBeInTheDocument();
  });

  it("shows a card for each project with title, category and description", () => {
    wrap(<Projects />);

    for (const project of PROJECTS) {
      expect(screen.getByRole("heading", { level: 3, name: project.title })).toBeInTheDocument();
      expect(screen.getByText(project.category.id)).toBeInTheDocument();
      expect(screen.getByText(project.description.id)).toBeInTheDocument();
    }
  });

  it("shows technology chips, with a logo when the skill has one", () => {
    wrap(<Projects />);

    const react = screen.getByText("React").closest("li")!;
    expect(react.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("React Three Fiber").closest("li")!.querySelector("svg")).toBeNull();
  });

  it("shows no link buttons while no project has a URL", () => {
    wrap(<Projects />);
    const region = screen.getByRole("region", { name: "Proyek" });

    expect(within(region).queryAllByRole("link")).toHaveLength(0);
  });

  it("switches to English", async () => {
    const user = userEvent.setup();
    wrap(<Projects />);

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByRole("region", { name: "Projects" })).toBeInTheDocument();
    for (const project of PROJECTS) {
      expect(screen.getByText(project.description.en)).toBeInTheDocument();
    }
  });
});

describe("ProjectCard links", () => {
  const base: Project = { ...PROJECTS[1], links: undefined };

  it("shows demo and source buttons that open safely in a new tab", () => {
    wrap(
      <ProjectCard
        project={{ ...base, links: { demo: "https://demo.example.com", repo: "https://github.com/x/y" } }}
      />,
    );

    const demo = screen.getByRole("link", { name: "Lihat Demo" });
    const repo = screen.getByRole("link", { name: "Kode Sumber" });
    expect(demo).toHaveAttribute("href", "https://demo.example.com");
    expect(repo).toHaveAttribute("href", "https://github.com/x/y");
    for (const link of [demo, repo]) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("shows only the buttons that have a URL", () => {
    wrap(<ProjectCard project={{ ...base, links: { repo: "https://github.com/x/y" } }} />);

    expect(screen.getByRole("link", { name: "Kode Sumber" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Lihat Demo" })).not.toBeInTheDocument();
  });

  it("uses English button labels after switching language", async () => {
    const user = userEvent.setup();
    wrap(
      <ProjectCard
        project={{ ...base, links: { demo: "https://demo.example.com", repo: "https://github.com/x/y" } }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByRole("link", { name: "Live Demo" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Source Code" })).toBeInTheDocument();
  });
});
