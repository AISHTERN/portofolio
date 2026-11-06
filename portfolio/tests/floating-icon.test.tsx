import { render, screen } from "@testing-library/react";
import { useReducedMotion } from "framer-motion";
import { SiReact } from "react-icons/si";
import { FloatingIcon } from "../src/components/ui/FloatingIcon";

vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return { ...actual, useReducedMotion: vi.fn() };
});

beforeEach(() => {
  vi.mocked(useReducedMotion).mockReturnValue(false);
});

afterEach(() => {
  vi.mocked(useReducedMotion).mockReset();
});

describe("FloatingIcon", () => {
  it("is exposed as an image with an accessible name", () => {
    render(<FloatingIcon icon={SiReact} label="React" />);

    expect(screen.getByRole("img", { name: "React" })).toBeInTheDocument();
  });

  it("hides the decorative svg from assistive technology", () => {
    const { container } = render(<FloatingIcon icon={SiReact} label="React" />);

    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("floats when motion is allowed", () => {
    render(<FloatingIcon icon={SiReact} label="React" />);

    expect(screen.getByRole("img", { name: "React" })).toHaveClass("float-icon");
  });

  it("does not float when reduced motion is preferred", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    render(<FloatingIcon icon={SiReact} label="React" />);

    expect(screen.getByRole("img", { name: "React" })).not.toHaveClass("float-icon");
  });

  it("passes delay and duration to the animation as CSS variables", () => {
    render(<FloatingIcon icon={SiReact} label="React" delay={1.5} duration={5} />);

    const icon = screen.getByRole("img", { name: "React" });
    expect(icon.style.getPropertyValue("--float-delay")).toBe("1.5s");
    expect(icon.style.getPropertyValue("--float-duration")).toBe("5s");
  });

  it("applies the brand color to the logo", () => {
    render(<FloatingIcon icon={SiReact} label="React" color="#61DAFB" />);

    expect(screen.getByRole("img", { name: "React" })).toHaveStyle({ color: "#61DAFB" });
  });

  it("puts positioning classes on the outer wrapper, not on the animated card", () => {
    render(<FloatingIcon icon={SiReact} label="React" className="absolute left-0 top-4" />);

    const card = screen.getByRole("img", { name: "React" });
    expect(card.parentElement).toHaveClass("absolute", "left-0", "top-4");
    expect(card).not.toHaveClass("absolute");
  });

  it("falls back to the label's initials when there is no logo", () => {
    const { container } = render(<FloatingIcon label="Prompt Engineering" />);

    expect(screen.getByRole("img", { name: "Prompt Engineering" })).toHaveTextContent("PE");
    expect(container.querySelector("svg")).toBeNull();
  });
});
