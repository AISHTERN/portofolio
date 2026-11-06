import {
  buildMailtoUrl,
  buildWhatsAppUrl,
  toInternationalPhone,
} from "../src/lib/contact";

describe("toInternationalPhone", () => {
  it("converts a local Indonesian number", () => {
    expect(toInternationalPhone("081284945531")).toBe("6281284945531");
  });

  it("accepts +62 with spaces and dashes", () => {
    expect(toInternationalPhone("+62 812-8494-5531")).toBe("6281284945531");
  });

  it("keeps numbers that are already international", () => {
    expect(toInternationalPhone("6281284945531")).toBe("6281284945531");
  });

  it("throws when there are no digits", () => {
    expect(() => toInternationalPhone("abc")).toThrow();
  });
});

describe("buildWhatsAppUrl", () => {
  it("builds a wa.me link with an encoded message", () => {
    expect(buildWhatsAppUrl("081284945531", "Halo, apa kabar?")).toBe(
      "https://wa.me/6281284945531?text=Halo%2C%20apa%20kabar%3F",
    );
  });

  it("omits the query string when there is no message", () => {
    expect(buildWhatsAppUrl("081284945531")).toBe("https://wa.me/6281284945531");
  });
});

describe("buildMailtoUrl", () => {
  it("encodes subject and body", () => {
    expect(buildMailtoUrl("a@b.com", "Halo dunia", "Baris 1\nBaris 2")).toBe(
      "mailto:a@b.com?subject=Halo%20dunia&body=Baris%201%0ABaris%202",
    );
  });

  it("returns a bare mailto link when nothing else is given", () => {
    expect(buildMailtoUrl("a@b.com")).toBe("mailto:a@b.com");
  });

  it("never uses + for spaces", () => {
    expect(buildMailtoUrl("a@b.com", "satu dua tiga")).not.toContain("+");
  });
});
