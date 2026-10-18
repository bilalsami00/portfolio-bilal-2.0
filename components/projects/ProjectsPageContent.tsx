import { useMemo, useState } from "react";
import { projectCategories, projects } from "../../data/projects";
import type { PortfolioProject, ProjectCategory } from "../../data/types";
import { getProjectImage } from "../../utilities/projectImages";
import Container from "../shared/Container";
import ProjectCard from "../shared/ProjectCard";
import ProjectDetailsModal from "../shared/ProjectDetailsModal";
import RevealOnScroll from "../shared/RevealOnScroll";
import SectionHeading from "../shared/SectionHeading";
import ContactCtaBanner from "../shared/ContactCtaBanner";
import TechTag from "../shared/TechTag";
import { ButtonLink } from "../shared/Button";

type FilterValue = ProjectCategory | "All";

/**
 * Full projects experience: hero, filters, featured spotlight, grid, details.
 */
const ProjectsPageContent = () => {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("All");
  const [selectedProject, setSelectedProject] =
    useState<PortfolioProject | null>(null);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  const featuredProject =
    filteredProjects.find((project) => project.featured) ||
    filteredProjects[0] ||
    null;

  const gridProjects = filteredProjects.filter(
    (project) => !featuredProject || project.id !== featuredProject.id
  );

  const featuredMedia = featuredProject
    ? getProjectImage(featuredProject.image, "tall")
    : null;

  return (
    <>
      <section
        className="pt-12 pb-10 sm:pt-16 sm:pb-12"
        aria-labelledby="projects-hero-title"
      >
        <Container>
          <div className="hero-enter">
            <p className="section-eyebrow">Projects</p>
            <div className="crimson-mark mt-4 mb-5" />
            <h1
              id="projects-hero-title"
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-parchment-100 max-w-4xl leading-[1.08] tracking-tight text-balance"
            >
              Frontend work from Maze Digital
            </h1>
            <p className="section-copy mt-5 max-w-3xl">
              Ten product case studies, ordered with Next.js, React, JavaScript,
              and Tailwind CSS work first. Each write-up describes the product.
              It is not a personal list of every feature I built.
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-8" aria-label="Project category filters">
        <Container>
          <div className="hero-enter hero-enter-delay">
            <div className="flex flex-wrap gap-2">
              {projectCategories.map((category) => {
                const isActive = activeFilter === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveFilter(category)}
                    aria-pressed={isActive}
                    className={`
                      inline-flex items-center min-h-[2.5rem] px-3.5 py-2 text-xs font-accent uppercase tracking-[0.16em] border transition-colors duration-200
                      ${
                        isActive
                          ? "border-crimson-500 bg-crimson-900/40 text-parchment-100"
                          : "border-steel-700 text-steel-300 hover:border-crimson-600/50 hover:text-parchment-200"
                      }
                    `}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-steel-400" aria-live="polite">
              {`Showing ${filteredProjects.length} project${
                filteredProjects.length === 1 ? "" : "s"
              }${activeFilter !== "All" ? ` in ${activeFilter}` : ""}.`}
            </p>
          </div>
        </Container>
      </section>

      {featuredProject && (
        <section
          className="py-8 sm:py-12"
          aria-labelledby="featured-project-title"
        >
          <Container>
            <RevealOnScroll>
              <SectionHeading
                eyebrow="Featured"
                title="Spotlight"
                description="A deeper look at one highlighted project from the current filter."
              />
            </RevealOnScroll>

            <RevealOnScroll delayClass="reveal-delay-2" className="mt-8">
              <article className="ink-panel overflow-hidden grid lg:grid-cols-2">
                <button
                  type="button"
                  className="relative overflow-hidden aspect-[16/10] lg:aspect-auto lg:min-h-[360px] text-left"
                  onClick={() => setSelectedProject(featuredProject)}
                  aria-label={`Open ${featuredProject.title}`}
                >
                  <img
                    src={featuredMedia?.src}
                    srcSet={featuredMedia?.srcSet}
                    sizes="(min-width: 1024px) 36rem, 100vw"
                    width={featuredMedia?.width}
                    height={featuredMedia?.height}
                    alt={featuredProject.imageAlt}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    decoding="async"
                  />
                  <div className="absolute inset-0 media-scrim-side" />
                </button>

                <div className="p-6 sm:p-8 lg:p-10 flex flex-col">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="tech-tag">{featuredProject.category}</span>
                    <span className="text-xs text-steel-400 font-accent tracking-widest uppercase">
                      {featuredProject.year}
                    </span>
                  </div>
                  <h2
                    id="featured-project-title"
                    className="font-display text-2xl sm:text-3xl text-parchment-100 font-bold leading-tight text-balance"
                  >
                    {featuredProject.title}
                  </h2>
                  <div className="mt-4 space-y-3">
                    {featuredProject.caseStudy.overview.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-parchment-400 leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="mt-5">
                    <h3 className="font-accent text-xs uppercase tracking-[0.2em] text-crimson-400">
                      Problem & solution
                    </h3>
                    <p className="mt-2 text-sm text-parchment-400">
                      {featuredProject.caseStudy.problem}
                    </p>
                    <p className="mt-2 text-sm text-parchment-400">
                      {featuredProject.caseStudy.solution}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {featuredProject.technologies.map((tech) => (
                      <TechTag key={`featured-${tech}`} label={tech} />
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => setSelectedProject(featuredProject)}
                    >
                      Full details
                    </button>
                    {featuredProject.liveUrl && (
                      <ButtonLink
                        href={featuredProject.liveUrl}
                        external
                        className="btn-sm"
                      >
                        Live link
                      </ButtonLink>
                    )}
                    {featuredProject.repositoryUrl && (
                      <ButtonLink
                        href={featuredProject.repositoryUrl}
                        variant="secondary"
                        external
                        className="btn-sm"
                      >
                        Repository
                      </ButtonLink>
                    )}
                  </div>
                </div>
              </article>
            </RevealOnScroll>
          </Container>
        </section>
      )}

      <section className="py-10 sm:py-14" aria-labelledby="projects-grid-title">
        <Container>
          <RevealOnScroll>
            <h2
              id="projects-grid-title"
              className="font-display text-2xl sm:text-3xl text-parchment-100 font-bold"
            >
              Complete archive
            </h2>
            <p className="mt-2 text-parchment-500 text-sm sm:text-base">
              Select any card for the case study, technologies, and screenshots.
            </p>
          </RevealOnScroll>

          {gridProjects.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {gridProjects.map((project, index) => (
                <RevealOnScroll
                  key={project.id}
                  delayClass={`reveal-delay-${(index % 4) + 1}`}
                  className="h-full"
                >
                  <ProjectCard
                    project={project}
                    onSelect={setSelectedProject}
                  />
                </RevealOnScroll>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-parchment-400">
              {featuredProject
                ? "No additional projects in this category."
                : "No projects match this filter yet."}
            </p>
          )}
        </Container>
      </section>

      <ContactCtaBanner
        eyebrow="Contact"
        title="Questions about this work?"
        description="These case studies describe product scope. Email or the contact form is the way to ask about them."
      />

      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};

export default ProjectsPageContent;
