import { formatDate } from "../src/lib/date";
import { publicUrl } from "../src/lib/publicUrl";

describe("publicUrl", () => {
  it("prefixes the base URL and tolerates a leading slash", () => {
    expect(publicUrl("certificates/a.pdf")).toBe("/certificates/a.pdf");
    expect(publicUrl("/certificates/a.pdf")).toBe("/certificates/a.pdf");
  });
});

describe("formatDate", () => {
  it("formats an ISO date in Indonesian", () => {
    expect(formatDate("2026-09-11", "id")).toBe("11 Sep 2026");
    expect(formatDate("2023-08-01", "id")).toBe("1 Agu 2023");
  });

  it("formats an ISO date in English", () => {
    expect(formatDate("2026-09-11", "en")).toBe("Sep 11, 2026");
    expect(formatDate("2023-08-01", "en")).toBe("Aug 1, 2023");
  });

  it("does not shift the day across time zones", () => {
    expect(formatDate("2026-01-01", "en")).toBe("Jan 1, 2026");
  });
});
