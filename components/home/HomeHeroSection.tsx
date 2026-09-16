import { siteAvailability, siteIdentity } from "../../data/site";
import { routePaths } from "../../data/navigation";
import { ButtonLink } from "../shared/Button";
import Container from "../shared/Container";
import RevealOnScroll from "../shared/RevealOnScroll";
import SocialLinksRow from "../shared/SocialLinksRow";

/**
 * Home hero — brand-forward, cinematic, professional.
 */
const HomeHeroSection = () => (
  <section
    className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-20 md:pt-20 md:pb-28"
    aria-labelledby="home-hero-name"
  >
    <div
      className="pointer-events-none absolute inset-0 opacity-40"
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(185,28,44,0.12) 0%, transparent 42%), radial-gradient(ellipse at 80% 20%, rgba(111,120,136,0.18), transparent 50%)",
      }}
      aria-hidden
    />

    <Container className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
      <RevealOnScroll className="lg:col-span-7">
        {siteAvailability.isAvailableForWork && (
          <p className="status-pill mb-6">{siteAvailability.statusLabel}</p>
        )}

        <p className="section-eyebrow">Software Developer Portfolio</p>
        <div className="crimson-mark mt-4 mb-6" />

        <h1
          id="home-hero-name"
          className="font-display text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold text-parchment-100 leading-[1.05]"
        >
          {siteIdentity.fullName}
        </h1>

        <p className="mt-4 font-accent text-lg sm:text-xl text-crimson-300 tracking-wide">
          {siteIdentity.professionalTitle}
        </p>

        <p className="mt-6 max-w-xl text-base sm:text-lg text-parchment-400 leading-relaxed">
          {siteIdentity.introduction}
        </p>

        <div className="mt-8 flex flex-col xs:flex-row flex-wrap gap-3">
          <ButtonLink href={routePaths.projects}>View projects</ButtonLink>
          <ButtonLink href={routePaths.contact} variant="secondary">
            Hire me
          </ButtonLink>
        </div>

        <div className="mt-8">
          <p className="mb-3 text-xs font-accent uppercase tracking-[0.2em] text-steel-400">
            Connect
          </p>
          <SocialLinksRow variant="primary" />
        </div>
      </RevealOnScroll>

      <RevealOnScroll delayClass="reveal-delay-2" className="lg:col-span-5">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            className="absolute -inset-3 border border-crimson-700/30 translate-x-2 translate-y-2"
            aria-hidden
          />
          <div className="relative overflow-hidden ink-panel">
            <img
              src={siteIdentity.profileImage}
              alt={`${siteIdentity.fullName} — portrait`}
              className="aspect-[4/5] w-full object-cover grayscale-[20%] contrast-[1.05]"
              width={640}
              height={800}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/20" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <p className="font-accent text-xs uppercase tracking-[0.22em] text-crimson-300">
                Currently
              </p>
              <p className="mt-2 text-sm text-parchment-200 leading-relaxed">
                {siteAvailability.statusDetail}
              </p>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </Container>
  </section>
);

export default HomeHeroSection;
