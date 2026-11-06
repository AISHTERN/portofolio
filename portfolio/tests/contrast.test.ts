import css from "../src/styles/index.css?raw";

type RGB = [number, number, number];

/** Membaca token warna ("--color-ink: 22 24 29") langsung dari CSS yang dipakai situs. */
function readTokens(source: string): Record<string, RGB> {
  const tokens: Record<string, RGB> = {};
  for (const match of source.matchAll(/--color-([\w-]+):\s*(\d+)\s+(\d+)\s+(\d+)/g)) {
    tokens[match[1]] = [Number(match[2]), Number(match[3]), Number(match[4])];
  }
  return tokens;
}

const channel = (value: number) => {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]: RGB) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

function contrast(a: RGB, b: RGB): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** `foreground` pada opasitas `alpha` di atas `background`. */
function blend(foreground: RGB, alpha: number, background: RGB): RGB {
  return foreground.map((v, i) => Math.round(v * alpha + background[i] * (1 - alpha))) as RGB;
}

const tokens = readTokens(css);
const WHITE: RGB = [255, 255, 255];
const AA_NORMAL_TEXT = 4.5;

describe("design tokens", () => {
  it("defines every token the stylesheet and Tailwind config rely on", () => {
    expect(Object.keys(tokens).sort()).toEqual(
      ["accent", "accent-soft", "canvas", "ink", "line", "muted", "surface"].sort(),
    );
  });
});

describe("WCAG AA contrast (4.5:1) for every text/background pair the site uses", () => {
  const pairs: [string, () => [RGB, RGB]][] = [
    ["ink on canvas (body text)", () => [tokens.ink, tokens.canvas]],
    ["ink on surface (cards)", () => [tokens.ink, tokens.surface]],
    ["ink/80 on canvas (hero role)", () => [blend(tokens.ink, 0.8, tokens.canvas), tokens.canvas]],
    ["muted on canvas (paragraphs)", () => [tokens.muted, tokens.canvas]],
    ["muted on surface (card text)", () => [tokens.muted, tokens.surface]],
    ["muted on accent-soft (contact intro)", () => [tokens.muted, tokens["accent-soft"]]],
    ["accent on canvas (eyebrows, links)", () => [tokens.accent, tokens.canvas]],
    ["accent on surface (card links)", () => [tokens.accent, tokens.surface]],
    ["accent on accent-soft (pills, active nav)", () => [tokens.accent, tokens["accent-soft"]]],
    ["white on accent (primary button, active filter)", () => [WHITE, tokens.accent]],
    ["white on accent/90 (button hover)", () => [WHITE, blend(tokens.accent, 0.9, tokens.canvas)]],
  ];

  for (const [name, colors] of pairs) {
    it(name, () => {
      const [foreground, background] = colors();
      expect(contrast(foreground, background)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
    });
  }
});
