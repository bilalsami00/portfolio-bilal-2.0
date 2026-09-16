import { hasRealTestimonials, testimonials } from "../../data/testimonials";
import Container from "../shared/Container";
import PlaceholderBadge from "../shared/PlaceholderBadge";
import RevealOnScroll from "../shared/RevealOnScroll";
import SectionHeading from "../shared/SectionHeading";

/**
 * Testimonials only render real praise when available.
 * Otherwise shows an honest placeholder scaffold.
 */
const HomeTestimonialsSection = () => (
  <section
    className="py-16 sm:py-20 bg-ink-950/40"
    aria-labelledby="testimonials-title"
  >
    <Container>
      <RevealOnScroll>
        <SectionHeading
          eyebrow="Testimonials"
          title={
            hasRealTestimonials
              ? "Words from collaborators"
              : "Testimonials scaffold"
          }
          description={
            hasRealTestimonials
              ? "Feedback from people who have worked with me directly."
              : "No verified testimonials exist in this repository yet. Replace these marked placeholders — do not invent praise."
          }
          align="center"
        />
      </RevealOnScroll>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {testimonials.map((item, index) => (
          <RevealOnScroll
            key={item.id}
            delayClass={`reveal-delay-${(index % 3) + 1}`}
            className="ink-panel p-6 sm:p-8"
          >
            {item.isPlaceholder && (
              <div className="mb-4">
                <PlaceholderBadge label="Awaiting real testimonial" />
              </div>
            )}
            <blockquote className="text-parchment-300 leading-relaxed text-base sm:text-lg">
              “{item.quote}”
            </blockquote>
            <footer className="mt-6 border-t border-steel-700/50 pt-4">
              <p className="font-display text-parchment-100 font-semibold">
                {item.authorName}
              </p>
              <p className="text-sm text-steel-400 mt-1">
                {item.authorRole} · {item.authorCompany}
              </p>
            </footer>
          </RevealOnScroll>
        ))}
      </div>
    </Container>
  </section>
);

export default HomeTestimonialsSection;
