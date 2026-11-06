#!/usr/bin/env node
/**
 * Audit statis aksesibilitas untuk seluruh src/**\/*.tsx (memakai compiler TypeScript).
 *
 *   npm run audit:a11y
 *
 * Memeriksa: <a>/<button> punya gaya fokus terlihat, <button> punya type, <img> punya alt,
 * <a> punya href (atau spread props), link target=_blank punya rel, dan tidak ada
 * <div>/<span> dengan onClick (kecuali backdrop lightbox yang punya alternatif keyboard: Esc).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );

const FOCUS_STYLE = /focus-visible:outline|focus:not-sr-only/;
const problems = [];
let checked = { a: 0, button: 0, img: 0 };

for (const file of walk("src").filter((f) => f.endsWith(".tsx"))) {
  const text = readFileSync(file, "utf8");
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);

  // Konstanta modul yang (langsung atau lewat konstanta lain) berisi gaya fokus,
  // mis. const RING = "focus-visible:outline ..."; const LINK = `... ${RING}`.
  const declarations = [];
  (function collect(node) {
    if (ts.isVariableDeclaration(node) && node.initializer) {
      declarations.push([node.name.getText(), node.initializer.getText()]);
    }
    node.forEachChild(collect);
  })(source);
  const ringNames = new Set();
  for (let changed = true; changed; ) {
    changed = false;
    for (const [name, init] of declarations) {
      if (ringNames.has(name)) continue;
      if (FOCUS_STYLE.test(init) || [...ringNames].some((n) => new RegExp(`\\b${n}\\b`).test(init))) {
        ringNames.add(name);
        changed = true;
      }
    }
  }

  const report = (node, message) => {
    const { line } = source.getLineAndCharacterOfPosition(node.getStart());
    problems.push(`${file}:${line + 1}  ${message}`);
  };

  (function visit(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText();
      const attrs = node.attributes.properties;
      const attr = (name) => attrs.find((a) => ts.isJsxAttribute(a) && a.name.getText() === name);
      const hasSpread = attrs.some((a) => ts.isJsxSpreadAttribute(a));
      const className = attr("className")?.getText() ?? "";

      if (tag === "a" || tag === "button") {
        checked[tag]++;
        const focusOk =
          FOCUS_STYLE.test(className) || [...ringNames].some((n) => new RegExp(`\\b${n}\\b`).test(className));
        if (!focusOk) report(node, `<${tag}> has no visible focus style`);
      }
      if (tag === "button" && !attr("type")) report(node, "<button> without type");
      if (tag === "a" && !attr("href") && !hasSpread) report(node, "<a> without href");
      if (tag === "a" && attr("target")?.getText().includes("_blank") && !attr("rel")) {
        report(node, "target=_blank without rel");
      }
      if (tag === "img") {
        checked.img++;
        if (!attr("alt")) report(node, "<img> without alt");
      }
      if ((tag === "div" || tag === "span") && attr("onClick") && !file.endsWith("ImageLightbox.tsx")) {
        report(node, `<${tag}> with onClick is not keyboard accessible (use a <button>)`);
      }
    }
    node.forEachChild(visit);
  })(source);
}

console.log(`Checked ${checked.a} <a>, ${checked.button} <button>, ${checked.img} <img> in src/**/*.tsx`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n` + problems.map((p) => "  - " + p).join("\n"));
  process.exit(1);
}
console.log("No accessibility problems found.");
