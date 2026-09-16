import { educationEntries } from "../../data/education";
import { routePaths } from "../../data/navigation";
import { ButtonLink } from "../shared/Button";
import Container from "../shared/Container";
import PlaceholderBadge from "../shared/PlaceholderBadge";
import RevealOnScroll from "../shared/RevealOnScroll";
import SectionHeading from "../shared/SectionHeading";

const HomeEducationPreviewSection = () => {
  const primary = educationEntries[0];

  return (
    <section
      className="py-16 sm:py-20 bg-ink-950/40"
      aria-labelledby="education-preview-title"
    >
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <RevealOnScroll className="lg:col-span-6">
            <SectionHeading
              eyebrow="Education"
              title="Foundations"
              description="Academic background preview. Linked to the full About page for certifications and deeper context."
            />
          </RevealOnScroll>

          <RevealOnScroll delayClass="reveal-delay-2" className="lg:col-span-6">
            {primary && (
              <div className="ink-panel p-6 sm:p-8">
                <div className="flex flex-wrap gap-2 mb-3">
                  {primary.isPlaceholder && <PlaceholderBadge />}
                  <span className="text-xs font-accent uppercase tracking-[0.18em] text-steel-400">
                    {primary.startDate} — {primary.endDate}
                  </span>
                </div>
                <h3 className="font-display text-2xl text-parchment-100 font-bold">
                  {primary.degree}
                </h3>
                <p className="mt-2 text-crimson-300">{primary.institution}</p>
                <p className="mt-1 text-sm text-steel-400">
                  {primary.location}
                </p>
                <p className="mt-4 text-parchment-400 text-sm leading-relaxed">
                  {primary.description}
                </p>
                <div className="mt-6">
                  <ButtonLink href={routePaths.about} variant="secondary">
                    Full education & certifications
                  </ButtonLink>
                </div>
              </div>
            )}
          </RevealOnScroll>
        </div>
      </Container>
    </section>
  );
};

export default HomeEducationPreviewSection;
