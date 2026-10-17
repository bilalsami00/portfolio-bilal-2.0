import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { PortfolioProject } from "../../data/types";
import { getProjectImage } from "../../utilities/projectImages";
import TechTag from "./TechTag";
import { ButtonLink } from "./Button";

type ProjectDetailsModalProps = {
  project: PortfolioProject | null;
  onClose: () => void;
};

const SectionHeading = ({ children }: { children: string }) => (
  <h3 className="font-accent text-sm uppercase tracking-[0.2em] text-crimson-400">
    {children}
  </h3>
);

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="mt-3 space-y-3">
    {items.map((item) => (
      <li
        key={item}
        className="flex gap-3 text-parchment-400 text-sm sm:text-base leading-relaxed break-words"
      >
        <span
          className="mt-2 h-1.5 w-1.5 shrink-0 bg-crimson-500"
          aria-hidden
        />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

/**
 * Case study overlay. Section order matches the source write-ups.
 */
const ProjectDetailsModal = ({
  project,
  onClose,
}: ProjectDetailsModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!project || !mounted) return null;

  const { caseStudy } = project;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 overlay-scrim"
        aria-label="Close project details"
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-3xl max-h-[92vh] overflow-y-auto overscroll-contain ink-panel border-crimson-700/30"
        data-lenis-prevent
      >
        <div className="sticky top-0 z-20 flex justify-end p-3 sm:p-4 surface-fade-top">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary btn-sm bg-ink-900/85"
          >
            Close
          </button>
        </div>

        <div className="bg-ink-950 -mt-4">
          {project.gallery.map((image, index) => {
            const media = getProjectImage(image.src, "full");
            return (
              <img
                key={image.src}
                src={media.src}
                width={media.width}
                height={media.height}
                alt={image.alt}
                className="mx-auto h-auto w-full max-w-full object-contain object-top"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            );
          })}
        </div>

        <div className="p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="tech-tag">{project.category}</span>
            <span className="text-xs text-steel-400 font-accent tracking-widest uppercase">
              {project.year}
            </span>
          </div>

          <h2
            id="project-modal-title"
            className="font-display text-2xl sm:text-3xl text-parchment-100 font-bold"
          >
            {project.title}
          </h2>

          <div className="mt-6">
            <SectionHeading>Overview</SectionHeading>
            <div className="mt-3 space-y-3">
              {caseStudy.overview.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-parchment-300 leading-relaxed break-words"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <SectionHeading>Problem & solution</SectionHeading>
            <p className="mt-3 text-parchment-400 leading-relaxed break-words">
              <span className="text-parchment-200">Problem. </span>
              {caseStudy.problem}
            </p>
            <p className="mt-3 text-parchment-400 leading-relaxed break-words">
              <span className="text-parchment-200">Solution. </span>
              {caseStudy.solution}
            </p>
          </div>

          <div className="mt-6">
            <SectionHeading>Features</SectionHeading>
            <BulletList items={caseStudy.features} />
          </div>

          <div className="mt-6">
            <SectionHeading>Challenges</SectionHeading>
            <BulletList items={caseStudy.challenges} />
          </div>

          <div className="mt-6">
            <SectionHeading>Lessons learned</SectionHeading>
            <BulletList items={caseStudy.lessons} />
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
    </div>,
    document.body
  );
};

export default ProjectDetailsModal;
