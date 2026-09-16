import Link from "next/link";
import type { PortfolioProject } from "../../data/types";
import PlaceholderBadge from "./PlaceholderBadge";
import TechTag from "./TechTag";

type ProjectCardProps = {
  project: PortfolioProject;
  onSelect?: (project: PortfolioProject) => void;
  featuredLayout?: boolean;
};

/**
 * Strong project card used on Home and Projects pages.
 */
const ProjectCard = ({
  project,
  onSelect,
  featuredLayout = false,
}: ProjectCardProps) => {
  const handleActivate = () => {
    if (onSelect) onSelect(project);
  };

  return (
    <article
      className={`
        group ink-panel ink-panel-hover overflow-hidden flex flex-col
        ${featuredLayout ? "md:flex-row" : ""}
      `}
    >
      <button
        type="button"
        onClick={handleActivate}
        className={`
          relative overflow-hidden text-left
          ${
            featuredLayout
              ? "md:w-[48%] min-h-[220px] md:min-h-full"
              : "aspect-[16/10]"
          }
        `}
        aria-label={`View details for ${project.title}`}
      >
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
        <span className="absolute left-4 top-4 tech-tag border-crimson-700/40 text-parchment-200">
          {project.category}
        </span>
      </button>

      <div
        className={`flex flex-1 flex-col p-5 sm:p-6 ${
          featuredLayout ? "md:p-8" : ""
        }`}
      >
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <p className="text-xs font-accent uppercase tracking-[0.2em] text-steel-400">
            {project.year}
          </p>
          {project.isPlaceholderContent && (
            <PlaceholderBadge label="Case study placeholder" />
          )}
        </div>

        <h3 className="font-display text-xl sm:text-2xl text-parchment-100 font-bold">
          {project.title}
        </h3>
        <p className="mt-3 text-sm sm:text-base text-parchment-400 leading-relaxed flex-1">
          {project.shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.slice(0, featuredLayout ? 6 : 4).map((tech) => (
            <TechTag key={`${project.id}-${tech}`} label={tech} />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleActivate}
            className="btn-secondary !px-4 !py-2 text-xs"
          >
            Details
          </button>
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary !px-4 !py-2 text-xs"
            >
              Live
            </Link>
          )}
          {project.repositoryUrl && (
            <Link
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary !px-4 !py-2 text-xs"
            >
              Repository
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
