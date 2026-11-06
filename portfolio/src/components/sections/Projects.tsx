import { PROJECTS } from "../../data/projects";
import { useLang } from "../../i18n/context";
import { ProjectCard } from "../ui/ProjectCard";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function Projects() {
  const { t } = useLang();

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <Reveal>
        <SectionHeading
          id="projects-title"
          eyebrow={t({ id: "Portofolio", en: "Portfolio" })}
          title={t({ id: "Proyek", en: "Projects" })}
          description={t({
            id: "Proyek yang pernah saya kerjakan, dari integrasi AI dan web 3D sampai platform e-commerce.",
            en: "Projects I have worked on, from AI and 3D web integration to an e-commerce platform.",
          })}
        />
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {PROJECTS.map((project, index) => (
          <Reveal key={project.id} delay={index * 0.08} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
