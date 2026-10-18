import { interestItems } from "../../data/interests";
import Container from "../shared/Container";
import RevealOnScroll from "../shared/RevealOnScroll";
import SectionHeading from "../shared/SectionHeading";
import SkillIcon from "../shared/SkillIcon";

const HomeInterestsSection = () => {
  if (interestItems.length === 0) return null;

  return (
    <section
      className="py-16 sm:py-20 md:py-24"
      aria-labelledby="interests-title"
    >
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Beyond the editor"
            title="Personal interests"
            description="Reading, photography, and traveling."
            align="center"
          />
        </RevealOnScroll>

        <div className="mt-10 sm:mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {interestItems.map((interest, index) => (
            <RevealOnScroll
              key={interest.id}
              delayClass={`reveal-delay-${(index % 3) + 1}`}
              className="ink-panel ink-panel-hover flex h-full flex-col p-6 sm:p-7"
            >
              <SkillIcon iconKey={interest.iconKey} className="h-8 w-8" />
              <h3 className="mt-4 font-display text-lg text-parchment-100 font-bold leading-snug">
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
};

export default HomeInterestsSection;
