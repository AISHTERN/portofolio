import { render, screen } from "@testing-library/react";
import { Button } from "../src/components/ui/Button";

describe("Button", () => {
  it("renders a link with its label and href", () => {
    render(<Button href="#contact">Hubungi</Button>);

    expect(screen.getByRole("link", { name: "Hubungi" })).toHaveAttribute("href", "#contact");
  });

  it("opens external links in a new tab safely", () => {
    render(
      <Button href="https://wa.me/6281" external>
        Chat
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Chat" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not add target or rel to internal links", () => {
    render(<Button href="#about">Tentang</Button>);

    const link = screen.getByRole("link", { name: "Tentang" });
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
  });

  it("sets the download attribute when given a file name", () => {
    render(
      <Button href="/cv.pdf" download="CV.pdf">
        Unduh
      </Button>,
    );

    expect(screen.getByRole("link", { name: "Unduh" })).toHaveAttribute("download", "CV.pdf");
  });
});
