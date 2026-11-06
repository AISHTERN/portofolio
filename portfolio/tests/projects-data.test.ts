import { PROJECTS } from "../src/data/projects";
import { getSkill } from "../src/data/skills";

describe("projects data", () => {
  it("lists the two CV projects in order", () => {
    expect(PROJECTS.map((p) => p.id)).toEqual(["virtual-assistant-chatbot-3d", "oh-my-cake"]);
    expect(PROJECTS.map((p) => p.title)).toEqual([
      "Virtual Assistant Chatbot 3D",
      "Oh My Cake",
    ]);
  });

  it("has text in both languages and a real English translation", () => {
    for (const project of PROJECTS) {
      expect(project.category.id.trim()).not.toBe("");
      expect(project.category.en.trim()).not.toBe("");
      expect(project.description.id.trim()).not.toBe("");
      expect(project.description.en.trim()).not.toBe("");
      expect(project.description.en).not.toBe(project.description.id);
    }
  });

  it("only references skills that exist", () => {
    for (const project of PROJECTS) {
      expect(project.tech.length).toBeGreaterThan(0);
      for (const tech of project.tech) {
        if (tech.skillId) expect(getSkill(tech.skillId)).toBeTruthy();
      }
    }
  });

  it("uses https for any link that is set", () => {
    for (const project of PROJECTS) {
      for (const url of Object.values(project.links ?? {})) {
        expect(url).toMatch(/^https:\/\//);
      }
    }
  });
});
