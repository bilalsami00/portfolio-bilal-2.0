import { useMemo, useState } from "react";
import { projectCategories, projects } from "../../data/projects";
import type { PortfolioProject, ProjectCategory } from "../../data/types";
import Container from "../shared/Container";
import ProjectCard from "../shared/ProjectCard";
import ProjectDetailsModal from "../shared/ProjectDetailsModal";
import RevealOnScroll from "../shared/RevealOnScroll";
import SectionHeading from "../shared/SectionHeading";
import ContactCtaBanner from "../shared/ContactCtaBanner";
import PlaceholderBadge from "../shared/PlaceholderBadge";
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

  return (
    <>
      <section
        className="pt-12 pb-10 sm:pt-16 sm:pb-12"
        aria-labelledby="projects-hero-title"
      >
        <Container>
          <RevealOnScroll>
            <p className="section-eyebrow">Projects</p>
            <div className="crimson-mark mt-4 mb-5" />
            <h1
              id="projects-hero-title"
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-parchment-100 max-w-4xl"
            >
              Work selected for craft, clarity, and consequence
            </h1>
            <p className="section-copy mt-5 max-w-3xl">
              Explore applications across web, mobile, desktop, and interface
              systems. Filter by category, open details for problem framing, and
              note placeholder case studies marked for replacement with real
              outcomes.
            </p>
          </RevealOnScroll>
        </Container>
      </section>

      <section className="pb-8" aria-label="Project category filters">
        <Container>
          <RevealOnScroll>
            <div className="flex flex-wrap gap-2">
              {projectCategories.map((category) => {
                const isActive = activeFilter === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveFilter(category)}
                    className={`
                      px-3 py-2 text-xs font-accent uppercase tracking-[0.16em] border transition-all duration-300
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
            <p className="mt-4 text-sm text-steel-400">
              Showing {filteredProjects.length} project
              {filteredProjects.length === 1 ? "" : "s"}
              {activeFilter !== "All" ? ` in ${activeFilter}` : ""}.
            </p>
          </RevealOnScroll>
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
                  className="relative min-h-[240px] lg:min-h-[360px] text-left"
                  onClick={() => setSelectedProject(featuredProject)}
                  aria-label={`Open ${featuredProject.title}`}
                >
                  <img
                    src={featuredProject.image}
                    alt={featuredProject.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-ink-950/30 to-ink-950/70" />
                </button>

                <div className="p-6 sm:p-8 lg:p-10 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="tech-tag">{featuredProject.category}</span>
                    {featuredProject.isPlaceholderContent && (
                      <PlaceholderBadge label="Case study placeholder" />
                    )}
                  </div>
                  <h2
                    id="featured-project-title"
                    className="font-display text-2xl sm:text-3xl text-parchment-100 font-bold"
                  >
                    {featuredProject.title}
                  </h2>
                  <p className="mt-4 text-parchment-400 leading-relaxed">
                    {featuredProject.fullDescription}
                  </p>

                  <div className="mt-5">
                    <h3 className="font-accent text-xs uppercase tracking-[0.2em] text-crimson-400">
                      Problem solved
                    </h3>
                    <p className="mt-2 text-sm text-parchment-400">
                      {featuredProject.problemSolved}
                    </p>
                  </div>

                  <div className="mt-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-accent text-xs uppercase tracking-[0.2em] text-crimson-400">
                        Outcomes
                      </h3>
                      {featuredProject.outcomesArePlaceholder && (
                        <PlaceholderBadge label="Outcomes placeholder" />
                      )}
                    </div>
                    <ul className="mt-2 space-y-2">
                      {featuredProject.outcomes.map((outcome) => (
                        <li
                          key={outcome}
                          className="text-sm text-parchment-400 flex gap-2"
                        >
                          <span
                            className="mt-2 h-1 w-1 shrink-0 bg-crimson-500"
                            aria-hidden
                          />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {featuredProject.technologies.map((tech) => (
                      <TechTag key={`featured-${tech}`} label={tech} />
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="btn-secondary !px-4 !py-2 text-xs"
                      onClick={() => setSelectedProject(featuredProject)}
                    >
                      Full details
                    </button>
                    {featuredProject.liveUrl && (
                      <ButtonLink
                        href={featuredProject.liveUrl}
                        external
                        className="!px-4 !py-2 text-xs"
                      >
                        Live link
                      </ButtonLink>
                    )}
                    {featuredProject.repositoryUrl && (
                      <ButtonLink
                        href={featuredProject.repositoryUrl}
                        variant="secondary"
                        external
                        className="!px-4 !py-2 text-xs"
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
              Select any card for technologies, use case, and outcomes.
            </p>
          </RevealOnScroll>

          {gridProjects.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {gridProjects.map((project, index) => (
                <RevealOnScroll
                  key={project.id}
                  delayClass={`reveal-delay-${(index % 4) + 1}`}
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
        eyebrow="Build with me"
        title="Need a similar product surface?"
        description="Share the problem space — architecture, interface, or delivery — and we can discuss scope."
      />

      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};

export default ProjectsPageContent;
