import { EDUCATION } from "../../data/education";
import { EXPERIENCES } from "../../data/experience";
import { useLang } from "../../i18n/context";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

const LIST_CLASS = "ml-2 space-y-10 border-l border-line pl-8";
const DOT_CLASS =
  "absolute -left-[2.4rem] top-2 h-3 w-3 rounded-full bg-accent ring-4 ring-canvas";
const META_CLASS = "mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted";

export function Experience() {
  const { t } = useLang();

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <Reveal>
        <SectionHeading
          id="experience-title"
          eyebrow={t({ id: "Perjalanan", en: "Journey" })}
          title={t({ id: "Pengalaman", en: "Experience" })}
          description={t({
            id: "Pengalaman kerja dan pendidikan yang membentuk keahlian saya.",
            en: "The work experience and education that shaped my skills.",
          })}
        />
      </Reveal>

      <div className="mt-12 grid gap-16 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h3
            id="work-title"
            className="mb-8 font-display text-xl font-semibold text-ink"
          >
            {t({ id: "Pengalaman Kerja", en: "Work Experience" })}
          </h3>
          <ol aria-labelledby="work-title" className={LIST_CLASS}>
            {EXPERIENCES.map((item, index) => (
              <li key={item.id} className="relative">
                <span aria-hidden="true" className={DOT_CLASS} />
                <Reveal delay={index * 0.08}>
                  <h4 className="font-display text-lg font-semibold text-ink">
                    {t(item.role)}
                  </h4>
                  <p className="mt-1 text-sm font-medium text-accent">{item.company}</p>
                  <p className={META_CLASS}>
                    {item.period && (
                      <>
                        <span>{t(item.period)}</span>
                        <span aria-hidden="true">·</span>
                      </>
                    )}
                    <span>{t(item.location)}</span>
                  </p>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-muted marker:text-accent">
                    {item.highlights.map((highlight) => (
                      <li key={highlight.en}>{t(highlight)}</li>
                    ))}
                  </ul>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h3
            id="education-title"
            className="mb-8 font-display text-xl font-semibold text-ink"
          >
            {t({ id: "Pendidikan", en: "Education" })}
          </h3>
          <ol aria-labelledby="education-title" className={LIST_CLASS}>
            {EDUCATION.map((item, index) => (
              <li key={item.id} className="relative">
                <span aria-hidden="true" className={DOT_CLASS} />
                <Reveal delay={index * 0.08}>
                  <h4 className="font-display text-lg font-semibold text-ink">
                    {t(item.program)}
                  </h4>
                  <p className="mt-1 text-sm font-medium text-accent">{item.institution}</p>
                  <p className={META_CLASS}>
                    <span>{item.years}</span>
                    <span aria-hidden="true">·</span>
                    <span>{t(item.location)}</span>
                  </p>
                  {item.note && (
                    <p className="mt-3 inline-block rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent">
                      {t(item.note)}
                    </p>
                  )}
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
