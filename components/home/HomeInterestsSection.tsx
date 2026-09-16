import { interestItems } from "../../data/interests";
import Container from "../shared/Container";
import RevealOnScroll from "../shared/RevealOnScroll";
import SectionHeading from "../shared/SectionHeading";

const HomeInterestsSection = () => (
  <section className="py-16 sm:py-20" aria-labelledby="interests-title">
    <Container>
      <RevealOnScroll>
        <SectionHeading
          eyebrow="Beyond the editor"
          title="Personal interests"
          description="Personality without gimmicks — curiosities that shape taste, pacing, and creative judgment."
          align="center"
        />
      </RevealOnScroll>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {interestItems.map((interest, index) => (
          <RevealOnScroll
            key={interest.id}
            delayClass={`reveal-delay-${(index % 5) + 1}`}
            className="ink-panel ink-panel-hover p-5"
          >
            <h3 className="font-display text-lg text-parchment-100 font-bold">
              {interest.title}
            </h3>
            <p className="mt-3 text-sm text-parchment-400 leading-relaxed">
              {interest.description}
            </p>
          </RevealOnScroll>
        ))}
      </div>
    </Container>
  </section>
);

export default HomeInterestsSection;
