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
  description = `Reach out to ${siteIdentity.shortName} about frontend work, project questions, or the resume.`,
}: ContactCtaBannerProps) => (
  <section
    className="py-16 sm:py-20 md:py-24"
    aria-labelledby="contact-cta-title"
  >
    <Container>
      <RevealOnScroll>
        <div className="ink-panel relative overflow-hidden px-6 py-12 sm:px-10 sm:py-14 md:px-14">
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 max-w-md opacity-40"
            style={{
              background:
                "radial-gradient(ellipse at 80% 30%, var(--color-accent-glow), transparent 65%)",
            }}
            aria-hidden
          />
          <div className="relative max-w-3xl">
            <p className="section-eyebrow">{eyebrow}</p>
            <div className="crimson-mark mt-3.5 mb-4 sm:mt-4 sm:mb-5" />
            <h2 id="contact-cta-title" className="section-title">
              {title}
            </h2>
            <p className="section-copy mt-3.5 sm:mt-4">{description}</p>
            <div className="mt-8 flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4">
              <ButtonLink href={routePaths.contact}>
                Start a conversation
              </ButtonLink>
              <ButtonLink href={routePaths.projects} variant="secondary">
                Review projects
              </ButtonLink>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </Container>
  </section>
);

export default ContactCtaBanner;
