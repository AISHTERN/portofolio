import css from "../src/styles/index.css?raw";

/** Isi blok `@media (prefers-reduced-motion: reduce) { ... }` (semua blok digabung). */
function reducedMotionCss(source: string): string {
  const blocks: string[] = [];
  const marker = "@media (prefers-reduced-motion: reduce)";
  let from = 0;
  for (;;) {
    const start = source.indexOf(marker, from);
    if (start === -1) break;
    let depth = 0;
    let end = start;
    for (let i = source.indexOf("{", start); i < source.length; i++) {
      if (source[i] === "{") depth++;
      if (source[i] === "}" && --depth === 0) {
        end = i;
        break;
      }
    }
    blocks.push(source.slice(start, end + 1));
    from = end + 1;
  }
  return blocks.join("\n");
}

describe("motion styles", () => {
  const reduced = reducedMotionCss(css);

  it("defines the float keyframes used by FloatingIcon", () => {
    expect(css).toMatch(/@keyframes float-y/);
    expect(css).toMatch(/\.float-icon\s*\{[^}]*animation:[^;]*float-y/);
  });

  it("turns the floating animation off under reduced motion", () => {
    expect(reduced).toMatch(/\.float-icon\s*\{[^}]*animation:\s*none/);
  });

  it("neutralises every other transition and animation under reduced motion", () => {
    expect(reduced).toMatch(/transition-duration:\s*0\.01ms\s*!important/);
    expect(reduced).toMatch(/animation-duration:\s*0\.01ms\s*!important/);
  });

  it("only smooth-scrolls when reduced motion is not requested", () => {
    expect(css).toMatch(/scroll-behavior:\s*smooth/);
    expect(reduced).toMatch(/scroll-behavior:\s*auto/);
  });

  it("clips accidental horizontal overflow instead of letting the page scroll sideways", () => {
    expect(css).toMatch(/overflow-x:\s*clip/);
  });
});
