import { SKILL_CATEGORIES } from "../../data/skills";
import { useLang } from "../../i18n/context";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function Skills() {
  const { t } = useLang();

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <Reveal>
        <SectionHeading
          id="skills-title"
          eyebrow={t({ id: "Keahlian", en: "Expertise" })}
          title={t({ id: "Skill", en: "Skills" })}
          description={t({
            id: "Teknologi dan keahlian yang saya gunakan dalam pengembangan web, AI, data, dan infrastruktur IT.",
            en: "Technologies and skills I use across web development, AI, data, and IT infrastructure.",
          })}
        />
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SKILL_CATEGORIES.map((category, index) => (
          <Reveal key={category.id} delay={index * 0.06} className="h-full">
            <article className="h-full rounded-card border border-line bg-surface p-6 shadow-soft">
              <h3 className="font-display text-lg font-semibold text-ink">
                {t(category.title)}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {category.skills.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <li
                      key={skill.id}
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 text-sm font-medium text-ink"
                    >
                      {Icon && (
                        <Icon
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0"
                          style={{ color: skill.color }}
                        />
                      )}
                      {t(skill.label)}
                    </li>
                  );
                })}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
