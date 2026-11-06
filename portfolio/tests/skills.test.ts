import { HERO_FLOATING_ICONS } from "../src/data/floatingIcons";
import { SKILL_BY_ID, SKILL_CATEGORIES, getSkill } from "../src/data/skills";

// Teknologi yang diminta di spec untuk ikon berlogo.
const LOGO_SKILL_IDS = [
  "laravel",
  "php",
  "javascript",
  "vuejs",
  "react",
  "python",
  "html5",
  "css3",
  "mysql",
  "postgresql",
  "git",
  "github",
  "figma",
  "postman",
  "threejs",
];

const allSkills = SKILL_CATEGORIES.flatMap((category) => category.skills);

describe("skills data", () => {
  it("has the five categories from the CV, in order", () => {
    expect(SKILL_CATEGORIES.map((c) => c.id)).toEqual([
      "ai",
      "web",
      "data",
      "hardware",
      "tools",
    ]);
  });

  it("gives every category a title in both languages and at least one skill", () => {
    for (const category of SKILL_CATEGORIES) {
      expect(category.title.id.trim()).not.toBe("");
      expect(category.title.en.trim()).not.toBe("");
      expect(category.skills.length).toBeGreaterThan(0);
    }
  });

  it("has a non-empty label in both languages for every skill", () => {
    for (const skill of allSkills) {
      expect(skill.label.id.trim()).not.toBe("");
      expect(skill.label.en.trim()).not.toBe("");
    }
  });

  it("has unique skill ids", () => {
    const ids = allSkills.map((skill) => skill.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has a logo for every technology listed in the spec", () => {
    for (const id of LOGO_SKILL_IDS) {
      expect(typeof getSkill(id).icon).toBe("function");
    }
  });

  it("uses valid hex colors when a color is given", () => {
    for (const skill of allSkills) {
      if (skill.color) expect(skill.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it("looks skills up by id and fails loudly for unknown ids", () => {
    expect(SKILL_BY_ID["react"].label.en).toBe("React");
    expect(() => getSkill("does-not-exist")).toThrow(/does-not-exist/);
  });
});

describe("hero floating icons", () => {
  it("shows between 6 and 10 icons", () => {
    expect(HERO_FLOATING_ICONS.length).toBeGreaterThanOrEqual(6);
    expect(HERO_FLOATING_ICONS.length).toBeLessThanOrEqual(10);
  });

  it("only references skills that exist and have a logo", () => {
    for (const spec of HERO_FLOATING_ICONS) {
      expect(typeof getSkill(spec.skillId).icon).toBe("function");
    }
  });

  it("uses each skill at most once", () => {
    const ids = HERO_FLOATING_ICONS.map((spec) => spec.skillId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has sane timing and an absolute position for each icon", () => {
    for (const spec of HERO_FLOATING_ICONS) {
      expect(spec.delay).toBeGreaterThanOrEqual(0);
      expect(spec.duration).toBeGreaterThan(0);
      expect(spec.position).toContain("absolute");
    }
  });
});
