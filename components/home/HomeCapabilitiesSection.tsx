import { serviceCategories } from "../../data/services";
import Container from "../shared/Container";
import RevealOnScroll from "../shared/RevealOnScroll";
import SectionHeading from "../shared/SectionHeading";
import SkillIcon from "../shared/SkillIcon";

const HomeCapabilitiesSection = () => (
  <section
    className="py-16 sm:py-20 md:py-24 bg-ink-950/40"
    aria-labelledby="capabilities-title"
  >
    <Container>
      <RevealOnScroll>
        <SectionHeading
          eyebrow="Capabilities"
          title="What I do"
          description="Service areas supported by the technologies and product surfaces already reflected in this repository."
          align="center"
        />
      </RevealOnScroll>

      <div className="mt-10 sm:mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {serviceCategories.map((service, index) => {
          const isLast = index === serviceCategories.length - 1;
          const orphanInTwoCols = isLast && serviceCategories.length % 2 === 1;
          const orphanInThreeCols =
            isLast && serviceCategories.length % 3 === 1;

          return (
            <RevealOnScroll
              key={service.id}
              delayClass={`reveal-delay-${(index % 5) + 1}`}
              className={`ink-panel ink-panel-hover p-6 h-full flex flex-col ${
                orphanInTwoCols ? "sm:col-span-2 xl:col-span-1" : ""
              } ${orphanInThreeCols ? "xl:col-start-2" : ""}`}
            >
              <div className="mb-1">
                <SkillIcon
                  iconKey={service.iconKey}
                  className="h-9 w-9 shrink-0"
                />
              </div>
              <h3 className="mt-4 font-display text-xl text-parchment-100 font-bold leading-snug">
                {service.title}
              </h3>
              <p className="mt-3 text-sm text-parchment-400 leading-relaxed">
                {service.description}
              </p>
              <ul className="mt-4 space-y-2.5">
                {service.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex gap-2.5 text-sm text-steel-300 leading-snug"
                  >
                    <span
                      className="mt-2 h-1 w-1 shrink-0 bg-crimson-500"
                      aria-hidden
                    />
                    {highlight}
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          );
        })}
      </div>
    </Container>
  </section>
);

export default HomeCapabilitiesSection;
