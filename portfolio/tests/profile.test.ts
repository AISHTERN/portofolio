import { PROFILE } from "../src/data/profile";
import { toInternationalPhone } from "../src/lib/contact";

describe("PROFILE data", () => {
  it("has the owner's name and role from the CV", () => {
    expect(PROFILE.name).toBe("Amrullah Valentino Caesar Putra");
    expect(PROFILE.role).toBe("Software Engineer · Google AI Professional");
  });

  it("has non-empty text in both languages", () => {
    const texts = [
      PROFILE.summary,
      PROFILE.availability,
      PROFILE.photoAlt,
      PROFILE.whatsappMessage,
      PROFILE.emailSubject,
      PROFILE.location,
    ];
    for (const text of texts) {
      expect(text.id.trim()).not.toBe("");
      expect(text.en.trim()).not.toBe("");
    }
  });

  it("has a valid email address", () => {
    expect(PROFILE.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it("has a phone number that converts to an Indonesian wa.me number", () => {
    expect(toInternationalPhone(PROFILE.phone)).toMatch(/^62\d{9,12}$/);
  });

  it("points GitHub at an https URL", () => {
    expect(PROFILE.github.url).toMatch(/^https:\/\/github\.com\/\w+$/);
  });

  it("serves the Indonesian CV as a PDF with a clean download name", () => {
    expect(PROFILE.cv.id.href.endsWith("cv.pdf")).toBe(true);
    expect(PROFILE.cv.id.fileName).toBe("CV_Amrullah_Valentino_Caesar_Putra.pdf");
  });

  it("has a downloadable PDF for English too (the Indonesian CV until an English one exists)", () => {
    expect(PROFILE.cv.en.href).toMatch(/\.pdf$/);
    expect(PROFILE.cv.en.fileName).toMatch(/^[\w.-]+\.pdf$/);
  });
});
