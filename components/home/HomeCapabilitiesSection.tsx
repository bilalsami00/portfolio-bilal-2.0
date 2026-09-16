import { serviceCategories } from "../../data/services";
import Container from "../shared/Container";
import RevealOnScroll from "../shared/RevealOnScroll";
import SectionHeading from "../shared/SectionHeading";
import SkillIcon from "../shared/SkillIcon";

const HomeCapabilitiesSection = () => (
  <section
    className="py-16 sm:py-20 bg-ink-950/40"
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

      <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {serviceCategories.map((service, index) => (
          <RevealOnScroll
            key={service.id}
            delayClass={`reveal-delay-${(index % 5) + 1}`}
            className="ink-panel ink-panel-hover p-6"
          >
            <div className="flex h-11 w-11 items-center justify-center border border-crimson-700/40 bg-crimson-900/30 text-crimson-300">
              <SkillIcon iconKey={service.iconKey} className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-xl text-parchment-100 font-bold">
              {service.title}
            </h3>
            <p className="mt-3 text-sm text-parchment-400 leading-relaxed">
              {service.description}
            </p>
            <ul className="mt-4 space-y-2">
              {service.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex gap-2 text-sm text-steel-300"
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
        ))}
      </div>
    </Container>
  </section>
);

export default HomeCapabilitiesSection;
