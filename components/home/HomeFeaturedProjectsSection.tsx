import { useState } from "react";
import { featuredProjects } from "../../data/projects";
import { routePaths } from "../../data/navigation";
import type { PortfolioProject } from "../../data/types";
import { ButtonLink } from "../shared/Button";
import Container from "../shared/Container";
import ProjectCard from "../shared/ProjectCard";
import ProjectDetailsModal from "../shared/ProjectDetailsModal";
import RevealOnScroll from "../shared/RevealOnScroll";
import SectionHeading from "../shared/SectionHeading";

const HomeFeaturedProjectsSection = () => {
  const [selectedProject, setSelectedProject] =
    useState<PortfolioProject | null>(null);

  return (
    <section
      className="py-16 sm:py-20"
      aria-labelledby="featured-projects-title"
    >
      <Container>
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionHeading
              eyebrow="Featured work"
              title="Projects forged in code"
              description="Selected work using existing portfolio imagery. Case narratives are clearly marked placeholders until real project write-ups replace them."
            />
            <ButtonLink
              href={routePaths.projects}
              variant="secondary"
              className="self-start md:self-auto"
            >
              All projects
            </ButtonLink>
          </div>
        </RevealOnScroll>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <RevealOnScroll
              key={project.id}
              delayClass={`reveal-delay-${(index % 3) + 1}`}
            >
              <ProjectCard
                project={project}
                featuredLayout={index === 0}
                onSelect={setSelectedProject}
              />
            </RevealOnScroll>
          ))}
        </div>
      </Container>

      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default HomeFeaturedProjectsSection;
