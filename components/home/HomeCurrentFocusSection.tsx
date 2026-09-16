import { currentFocusItems } from "../../data/site";
import Container from "../shared/Container";
import RevealOnScroll from "../shared/RevealOnScroll";
import SectionHeading from "../shared/SectionHeading";

const HomeCurrentFocusSection = () => (
  <section className="py-16 sm:py-20" aria-labelledby="current-focus-title">
    <Container>
      <RevealOnScroll>
        <SectionHeading
          eyebrow="Current focus"
          title="What the forge is tempering now"
          description="Active technical emphasis drawn from the stack already present in this portfolio."
        />
      </RevealOnScroll>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {currentFocusItems.map((item, index) => (
          <RevealOnScroll
            key={item.id}
            delayClass={`reveal-delay-${Math.min(index + 1, 5)}`}
            className="ink-panel ink-panel-hover p-5 sm:p-6"
          >
            <p className="font-accent text-xs uppercase tracking-[0.2em] text-crimson-400">
              0{index + 1}
            </p>
            <h3 className="mt-3 font-display text-xl text-parchment-100 font-bold">
              {item.label}
            </h3>
            <p className="mt-3 text-sm text-parchment-400 leading-relaxed">
              {item.description}
            </p>
          </RevealOnScroll>
        ))}
      </div>
    </Container>
  </section>
);

export default HomeCurrentFocusSection;
