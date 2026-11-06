import type { Config } from "tailwindcss";

// Warna dibaca dari CSS variables (lihat src/styles/index.css) agar
// seluruh tema terang hanya diatur di satu tempat.
const token = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: token("canvas"),
        surface: token("surface"),
        ink: token("ink"),
        muted: token("muted"),
        line: token("line"),
        accent: token("accent"),
        "accent-soft": token("accent-soft"),
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans"', '"Inter"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "1.25rem",
      },
      boxShadow: {
        soft: "0 8px 30px -12px rgb(22 24 29 / 0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;
