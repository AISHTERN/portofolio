import { render, screen } from "@testing-library/react";
import { useReducedMotion } from "framer-motion";
import { Reveal } from "../src/components/ui/Reveal";

vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return { ...actual, useReducedMotion: vi.fn() };
});

afterEach(() => {
  vi.mocked(useReducedMotion).mockReset();
});

describe("Reveal", () => {
  it("starts hidden and animates in when motion is allowed", () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    render(
      <Reveal>
        <p>Konten</p>
      </Reveal>,
    );

    expect(screen.getByText("Konten")).toBeInTheDocument();
    expect(screen.getByText("Konten").parentElement).toHaveStyle({ opacity: "0" });
  });

  it("shows content immediately, without animation, when reduced motion is preferred", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    render(
      <Reveal>
        <p>Konten</p>
      </Reveal>,
    );

    const wrapper = screen.getByText("Konten").parentElement!;
    expect(wrapper).not.toHaveStyle({ opacity: "0" });
    expect(wrapper.getAttribute("style") ?? "").not.toMatch(/transform/);
  });

  it("passes className through to the wrapper", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    render(
      <Reveal className="mt-8">
        <p>Konten</p>
      </Reveal>,
    );

    expect(screen.getByText("Konten").parentElement).toHaveClass("mt-8");
  });
});
