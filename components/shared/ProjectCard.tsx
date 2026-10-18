import Link from "next/link";
import type { PortfolioProject } from "../../data/types";
import { getProjectImage } from "../../utilities/projectImages";
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

  const media = getProjectImage(
    project.image,
    featuredLayout ? "tall" : "cover"
  );

  return (
    <article
      className={`
        group ink-panel ink-panel-hover overflow-hidden flex flex-col h-full
        ${featuredLayout ? "md:flex-row" : ""}
      `}
    >
      <button
        type="button"
        onClick={handleActivate}
        className={`
          relative overflow-hidden text-left shrink-0
          ${
            featuredLayout
              ? "aspect-[16/10] md:aspect-auto md:w-[48%] md:min-h-[320px]"
              : "aspect-[16/10]"
          }
        `}
        aria-label={`View details for ${project.title}`}
      >
        <img
          src={media.src}
          srcSet={media.srcSet}
          sizes={
            featuredLayout
              ? "(min-width: 1024px) 34rem, (min-width: 768px) 48vw, 100vw"
              : "(min-width: 1024px) 34rem, (min-width: 768px) 50vw, 100vw"
          }
          width={media.width}
          height={media.height}
          alt={project.imageAlt}
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 media-scrim" />
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
        </div>

        <h3 className="font-display text-xl sm:text-2xl text-parchment-100 font-bold leading-snug text-balance">
          {project.title}
        </h3>
        <p className="mt-3 text-sm sm:text-base text-parchment-400 leading-relaxed flex-1 text-pretty">
          {project.shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.slice(0, featuredLayout ? 6 : 4).map((tech) => (
            <TechTag key={`${project.id}-${tech}`} label={tech} />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleActivate}
            className="btn-secondary btn-sm"
          >
            Details
          </button>
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-sm"
            >
              Live demo
            </Link>
          )}
          {project.productionUrl && (
            <Link
              href={project.productionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary btn-sm"
            >
              Production
            </Link>
          )}
          {project.repositoryUrl && (
            <Link
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary btn-sm"
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
