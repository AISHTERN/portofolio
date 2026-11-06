import { ABOUT_FACTS, ABOUT_PARAGRAPHS } from "../src/data/about";
import { EDUCATION } from "../src/data/education";
import { EXPERIENCES } from "../src/data/experience";
import { PROFILE } from "../src/data/profile";
import type { Localized } from "../src/i18n/types";

function expectBothLanguages(text: Localized) {
  expect(text.id.trim()).not.toBe("");
  expect(text.en.trim()).not.toBe("");
}

describe("experience data", () => {
  it("lists the three positions from the CV in CV order", () => {
    expect(EXPERIENCES.map((item) => item.company)).toEqual([
      "PT Global Alfa Solusindo",
      "PT Bogajaya Sukses Abadi",
      "CV. Credibug Partner Solutions",
    ]);
  });

  it("has unique ids", () => {
    const ids = EXPERIENCES.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has text in both languages for role, location and period", () => {
    for (const item of EXPERIENCES) {
      expectBothLanguages(item.role);
      expectBothLanguages(item.location);
      if (item.period) expectBothLanguages(item.period);
    }
  });

  it("has at least two highlights per position, each in both languages", () => {
    for (const item of EXPERIENCES) {
      expect(item.highlights.length).toBeGreaterThanOrEqual(2);
      for (const highlight of item.highlights) expectBothLanguages(highlight);
    }
  });

  it("has a real English translation, not a copy of the Indonesian text", () => {
    for (const item of EXPERIENCES) {
      for (const highlight of item.highlights) {
        expect(highlight.en).not.toBe(highlight.id);
      }
    }
  });
});

describe("education data", () => {
  it("lists university then vocational school, as in the CV", () => {
    expect(EDUCATION.map((item) => item.institution)).toEqual([
      "Universitas Mercu Buana",
      "SMKN 56 Jakarta",
    ]);
  });

  it("has unique ids", () => {
    const ids = EDUCATION.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has years like '2022 – 2026' and text in both languages", () => {
    for (const item of EDUCATION) {
      expect(item.years).toMatch(/^\d{4} – \d{4}$/);
      expectBothLanguages(item.program);
      expectBothLanguages(item.location);
      if (item.note) expectBothLanguages(item.note);
    }
  });

  it("records that the diploma is still pending for the university", () => {
    const university = EDUCATION[0];
    expect(university.note?.id).toMatch(/ijazah/i);
    expect(university.note?.en).toMatch(/diploma/i);
  });
});

describe("about data", () => {
  it("has at least two paragraphs with real translations", () => {
    expect(ABOUT_PARAGRAPHS.length).toBeGreaterThanOrEqual(2);
    for (const paragraph of ABOUT_PARAGRAPHS) {
      expectBothLanguages(paragraph);
      expect(paragraph.en).not.toBe(paragraph.id);
    }
  });

  it("has four quick facts in both languages with unique ids", () => {
    expect(ABOUT_FACTS.map((fact) => fact.id)).toEqual([
      "location",
      "education",
      "focus",
      "availability",
    ]);
    for (const fact of ABOUT_FACTS) {
      expectBothLanguages(fact.label);
      expectBothLanguages(fact.value);
    }
  });

  it("reuses location and availability from the profile", () => {
    const byId = Object.fromEntries(ABOUT_FACTS.map((fact) => [fact.id, fact]));
    expect(byId["location"].value).toEqual(PROFILE.location);
    expect(byId["availability"].value).toEqual(PROFILE.availability);
  });
});
