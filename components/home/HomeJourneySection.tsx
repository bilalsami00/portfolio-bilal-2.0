import { experienceEntries } from "../../data/experience";
import Container from "../shared/Container";
import PlaceholderBadge from "../shared/PlaceholderBadge";
import RevealOnScroll from "../shared/RevealOnScroll";
import SectionHeading from "../shared/SectionHeading";
import TechTag from "../shared/TechTag";

const HomeJourneySection = () => (
  <section className="py-16 sm:py-20 md:py-24" aria-labelledby="journey-title">
    <Container>
      <RevealOnScroll>
        <SectionHeading
          eyebrow="Professional journey"
          title="Experience timeline"
          description="Maze Digital from January 2025 to the present, then earlier roles with only the dates and employers the CV records."
        />
      </RevealOnScroll>

      <ol className="portfolio-timeline mt-10 sm:mt-12 space-y-8 pl-8 md:pl-0">
        {experienceEntries.map((entry, index) => (
          <RevealOnScroll
            key={entry.id}
            as="li"
            delayClass={`reveal-delay-${(index % 3) + 1}`}
            className="relative md:grid md:grid-cols-2 md:gap-10"
          >
            <span
              className="absolute left-[-1.55rem] md:left-1/2 md:-translate-x-1/2 top-3 h-3 w-3 bg-crimson-500 shadow-[0_0_10px_var(--color-accent-glow)]"
              aria-hidden
            />

            <div
              className={`${
                index % 2 === 0
                  ? "md:text-right md:pr-10"
                  : "md:col-start-2 md:pl-10"
              }`}
            >
              <div className="ink-panel p-5 sm:p-6 inline-block w-full text-left">
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <p className="text-xs font-accent uppercase tracking-[0.18em] text-steel-400">
                    {entry.startDate} — {entry.endDate}
                  </p>
                  {entry.isPlaceholder && <PlaceholderBadge />}
                </div>
                <h3 className="font-display text-xl text-parchment-100 font-bold leading-snug">
                  {entry.role}
                </h3>
                <p className="mt-1.5 text-crimson-300 font-accent text-sm tracking-wide">
                  {entry.company} · {entry.location}
                </p>
                <p className="mt-3 text-sm text-parchment-400 leading-relaxed">
                  {entry.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.technologies.map((tech) => (
                    <TechTag key={`${entry.id}-${tech}`} label={tech} />
                  ))}
                </div>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </ol>
    </Container>
  </section>
);

export default HomeJourneySection;
