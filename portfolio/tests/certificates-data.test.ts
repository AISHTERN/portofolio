import { CERTIFICATES, certificateAssets } from "../src/data/certificates";

describe("certificates data", () => {
  it("lists the three certificates with files, in CV order", () => {
    expect(CERTIFICATES.map((c) => c.id)).toEqual(["google-ai", "meta-frontend", "cisco-ccna-itn"]);
  });

  it("has unique ids, ISO dates and text in both languages", () => {
    expect(new Set(CERTIFICATES.map((c) => c.id)).size).toBe(CERTIFICATES.length);
    for (const c of CERTIFICATES) {
      expect(c.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(c.issuer.trim()).not.toBe("");
      expect(c.title.id.trim()).not.toBe("");
      expect(c.description.id.trim()).not.toBe("");
      expect(c.description.en.trim()).not.toBe("");
      expect(c.description.en).not.toBe(c.description.id);
    }
  });

  it("has verification links only where the certificate provides one", () => {
    const byId = Object.fromEntries(CERTIFICATES.map((c) => [c.id, c]));
    expect(byId["google-ai"].verifyUrl).toBe(
      "https://coursera.org/verify/professional-cert/A1LXK6XLZ3YS",
    );
    expect(byId["meta-frontend"].verifyUrl).toBe("https://coursera.org/verify/QBNRZNRTYLBJ");
    expect(byId["cisco-ccna-itn"].verifyUrl).toBeUndefined();
  });

  it("derives asset paths from the id", () => {
    expect(certificateAssets("google-ai")).toEqual({
      thumb: "/certificates/google-ai-thumb.webp",
      full: "/certificates/google-ai-full.webp",
      pdf: "/certificates/google-ai.pdf",
    });
  });
});
