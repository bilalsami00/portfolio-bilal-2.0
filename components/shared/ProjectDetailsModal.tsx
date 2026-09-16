import { useEffect } from "react";
import Link from "next/link";
import type { PortfolioProject } from "../../data/types";
import PlaceholderBadge from "./PlaceholderBadge";
import TechTag from "./TechTag";
import { ButtonLink } from "./Button";

type ProjectDetailsModalProps = {
  project: PortfolioProject | null;
  onClose: () => void;
};

/**
 * Project details overlay for filtering / featured interactions.
 */
const ProjectDetailsModal = ({
  project,
  onClose,
}: ProjectDetailsModalProps) => {
  useEffect(() => {
    if (!project) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
        aria-label="Close project details"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-3xl max-h-[92vh] overflow-y-auto ink-panel border-crimson-700/30">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 btn-secondary !px-3 !py-1.5 text-xs"
          >
            Close
          </button>
        </div>

        <div className="p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="tech-tag">{project.category}</span>
            <span className="text-xs text-steel-400 font-accent tracking-widest uppercase">
              {project.year}
            </span>
            {project.isPlaceholderContent && <PlaceholderBadge />}
          </div>

          <h2
            id="project-modal-title"
            className="font-display text-2xl sm:text-3xl text-parchment-100 font-bold"
          >
            {project.title}
          </h2>
          <p className="mt-4 text-parchment-300 leading-relaxed">
            {project.fullDescription}
          </p>

          <div className="mt-6">
            <h3 className="font-accent text-sm uppercase tracking-[0.2em] text-crimson-400">
              Problem solved
            </h3>
            <p className="mt-2 text-parchment-400">{project.problemSolved}</p>
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-accent text-sm uppercase tracking-[0.2em] text-crimson-400">
                Outcomes
              </h3>
              {project.outcomesArePlaceholder && (
                <PlaceholderBadge label="Outcomes placeholder" />
              )}
            </div>
            <ul className="mt-3 space-y-2">
              {project.outcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="flex gap-3 text-parchment-400 text-sm sm:text-base"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 bg-crimson-500"
                    aria-hidden
                  />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <TechTag key={`${project.id}-modal-${tech}`} label={tech} />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.liveUrl && (
              <ButtonLink href={project.liveUrl} external>
                View live
              </ButtonLink>
            )}
            {project.repositoryUrl && (
              <ButtonLink
                href={project.repositoryUrl}
                variant="secondary"
                external
              >
                View repository
              </ButtonLink>
            )}
            <Link href="/contact" className="btn-secondary" onClick={onClose}>
              Discuss similar work
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
