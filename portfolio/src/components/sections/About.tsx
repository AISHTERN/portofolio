import { ABOUT_FACTS, ABOUT_PARAGRAPHS } from "../../data/about";
import { useLang } from "../../i18n/context";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function About() {
  const { t } = useLang();

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <Reveal>
          <SectionHeading
            id="about-title"
            eyebrow={t({ id: "Profil", en: "Profile" })}
            title={t({ id: "Tentang Saya", en: "About Me" })}
          />
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
            {ABOUT_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph.en}>{t(paragraph)}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="rounded-card border border-line bg-surface p-6 shadow-soft">
            {ABOUT_FACTS.map((fact) => (
              <div
                key={fact.id}
                className="border-b border-line py-4 first:pt-0 last:border-b-0 last:pb-0"
              >
                <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                  {t(fact.label)}
                </dt>
                <dd className="mt-1 font-medium text-ink">{t(fact.value)}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
