import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";
import { NAV_IDS } from "../src/data/navigation";

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.lang = "";
  vi.restoreAllMocks();
});

describe("App", () => {
  it("shows the owner's name as the main heading", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Amrullah Valentino Caesar Putra/i,
      }),
    ).toBeInTheDocument();
  });

  it("shows the professional role under the name", () => {
    render(<App />);

    expect(
      screen.getByText(/Software Engineer · Google AI Professional/i),
    ).toBeInTheDocument();
  });

  it("switches the welcome text between Indonesian and English", async () => {
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["id-ID"]);
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByText("Selamat datang di portofolio saya"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "English" }));
    expect(screen.getByText("Welcome to my portfolio")).toBeInTheDocument();
  });

  it("has a skip link as the first focusable element", async () => {
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["id-ID"]);
    const user = userEvent.setup();
    render(<App />);

    await user.tab();

    const skip = screen.getByRole("link", { name: "Lewati ke konten" });
    expect(skip).toHaveFocus();
    expect(skip).toHaveAttribute("href", "#main");
    expect(document.getElementById("main")).toBeInTheDocument();
  });

  it("renders a section for every navigation item", () => {
    render(<App />);

    for (const id of ["home", ...NAV_IDS]) {
      expect(document.getElementById(id)).toBeInTheDocument();
    }
  });

  it("has exactly one language switch", () => {
    render(<App />);

    expect(screen.getAllByRole("group", { name: "Bahasa / Language" })).toHaveLength(1);
  });

  it("renders the sections in the same order as the navigation", () => {
    render(<App />);

    const ids = Array.from(document.querySelectorAll("main > section")).map((el) => el.id);
    expect(ids).toEqual(["home", ...NAV_IDS]);
  });
});
