import { NAV_IDS, NAV_ITEMS } from "../src/data/navigation";
import { pickActiveId } from "../src/hooks/useActiveSection";

describe("navigation data", () => {
  it("has unique section ids", () => {
    expect(new Set(NAV_IDS).size).toBe(NAV_IDS.length);
  });

  it("covers every section of the page in order", () => {
    expect(NAV_IDS).toEqual([
      "about",
      "experience",
      "skills",
      "projects",
      "certificates",
      "gallery",
      "contact",
    ]);
  });

  it("has a non-empty label in both languages", () => {
    for (const item of NAV_ITEMS) {
      expect(item.label.id.trim()).not.toBe("");
      expect(item.label.en.trim()).not.toBe("");
    }
  });
});

describe("pickActiveId", () => {
  const ids = ["about", "skills", "contact"];

  it("returns null when nothing is visible", () => {
    expect(pickActiveId(ids, new Set())).toBeNull();
  });

  it("returns the topmost visible section in page order", () => {
    expect(pickActiveId(ids, new Set(["contact", "skills"]))).toBe("skills");
  });

  it("ignores ids that are not part of the navigation", () => {
    expect(pickActiveId(ids, new Set(["home"]))).toBeNull();
  });
});
