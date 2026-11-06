import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { About } from "./components/sections/About";
import { Certificates } from "./components/sections/Certificates";
import { Contact } from "./components/sections/Contact";
import { Experience } from "./components/sections/Experience";
import { Gallery } from "./components/sections/Gallery";
import { Hero } from "./components/sections/Hero";
import { Projects } from "./components/sections/Projects";
import { Skills } from "./components/sections/Skills";
import { useDocumentMeta } from "./hooks/useDocumentMeta";
import { useLang } from "./i18n/context";
import { LanguageProvider } from "./i18n/LanguageProvider";

function Page() {
  const { t } = useLang();
  useDocumentMeta();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        {t({ id: "Lewati ke konten", en: "Skip to content" })}
      </a>

      <Navbar />

      {/* Urutan di sini harus sama dengan NAV_ITEMS (diuji di App.test). */}
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Certificates />
        <Gallery />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Page />
    </LanguageProvider>
  );
}
