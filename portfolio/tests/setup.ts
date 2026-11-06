import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// jsdom tidak punya IntersectionObserver; stub ini mencegah error di komponen
// yang memakainya (Reveal, Navbar). Test yang butuh perilaku nyata menimpanya.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
