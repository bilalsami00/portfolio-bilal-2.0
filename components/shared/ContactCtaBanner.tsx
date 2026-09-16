import { ButtonLink } from "./Button";
import Container from "./Container";
import RevealOnScroll from "./RevealOnScroll";
import { routePaths } from "../../data/navigation";
import { siteIdentity } from "../../data/site";

type ContactCtaBannerProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

/**
 * Closing call-to-action reused on Home, Projects, and About.
 */
const ContactCtaBanner = ({
  eyebrow = "Next chapter",
  title = "Have a role, product, or problem worth building?",
  description = `Reach out to ${siteIdentity.shortName} — open to thoughtful collaborations, engineering roles, and product work that demands care.`,
}: ContactCtaBannerProps) => (
  <section
    className="py-16 sm:py-20 md:py-24"
    aria-labelledby="contact-cta-title"
  >
    <Container>
      <RevealOnScroll>
        <div className="ink-panel relative overflow-hidden px-6 py-12 sm:px-10 sm:py-14 md:px-14">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-crimson-700/20 blur-3xl"
            aria-hidden
          />
          <p className="section-eyebrow">{eyebrow}</p>
          <div className="crimson-mark mt-4 mb-5" />
          <h2 id="contact-cta-title" className="section-title max-w-3xl">
            {title}
          </h2>
          <p className="section-copy mt-4">{description}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <ButtonLink href={routePaths.contact}>
              Start a conversation
            </ButtonLink>
            <ButtonLink href={routePaths.projects} variant="secondary">
              Review projects
            </ButtonLink>
          </div>
        </div>
      </RevealOnScroll>
    </Container>
  </section>
);

export default ContactCtaBanner;
