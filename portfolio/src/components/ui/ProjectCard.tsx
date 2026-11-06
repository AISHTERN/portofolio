import type { Project } from "../../data/projects";
import { getSkill } from "../../data/skills";
import { useLang } from "../../i18n/context";
import { Button } from "./Button";

type ProjectCardProps = { project: Project };

export function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useLang();
  const { demo, repo } = project.links ?? {};

  return (
    <article className="flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-soft sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent">
        {t(project.category)}
      </p>
      <h3 className="mt-3 font-display text-2xl font-bold text-ink">{project.title}</h3>
      <p className="mt-4 text-base leading-relaxed text-muted">{t(project.description)}</p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {project.tech.map((tech) => {
          const skill = tech.skillId ? getSkill(tech.skillId) : undefined;
          const Icon = skill?.icon;
          return (
            <li
              key={tech.name}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 text-sm font-medium text-ink"
            >
              {Icon && (
                <Icon
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0"
                  style={{ color: skill?.color }}
                />
              )}
              {tech.name}
            </li>
          );
        })}
      </ul>

      {(demo || repo) && (
        <div className="mt-auto flex flex-wrap gap-3 pt-8">
          {demo && (
            <Button href={demo} external>
              {t({ id: "Lihat Demo", en: "Live Demo" })}
            </Button>
          )}
          {repo && (
            <Button href={repo} external variant="secondary">
              {t({ id: "Kode Sumber", en: "Source Code" })}
            </Button>
          )}
        </div>
      )}
    </article>
  );
}
