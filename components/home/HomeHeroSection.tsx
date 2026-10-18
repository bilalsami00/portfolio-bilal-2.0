import { siteAvailability, siteIdentity } from "../../data/site";
import { routePaths } from "../../data/navigation";
import { ButtonLink } from "../shared/Button";
import Container from "../shared/Container";
import SocialLinksRow from "../shared/SocialLinksRow";
import Shapes from "../shapes";
import HomeLightHeroVisual from "./HomeLightHeroVisual";

/**
 * Home hero. One composition in both themes; dark mode only recolors surfaces.
 */
const HomeHeroSection = () => (
  <section
    className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-20 md:pt-16 md:pb-24 lg:pt-20 lg:pb-28"
    aria-labelledby="home-hero-name"
  >
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden hidden lg:block"
      aria-hidden
    >
      <Shapes />
    </div>

    <Container className="relative z-[1] grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
      <div className="hero-enter lg:col-span-7">
        {siteAvailability.isAvailableForWork && (
          <p className="status-pill mb-6">{siteAvailability.statusLabel}</p>
        )}

        <p className="section-eyebrow">Software Developer Portfolio</p>
        <div className="crimson-mark mt-3.5 mb-5 sm:mt-4 sm:mb-6" />

        <h1
          id="home-hero-name"
          className="font-display text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold text-parchment-100 leading-[1.05] tracking-tight text-balance"
        >
          {siteIdentity.fullName}
        </h1>

        <p className="mt-4 font-accent text-lg sm:text-xl text-crimson-300 tracking-wide">
          {siteIdentity.professionalTitle}
        </p>

        <p className="mt-6 max-w-xl text-base sm:text-lg text-parchment-400 leading-relaxed text-pretty">
          {siteIdentity.introduction}
        </p>

        <div className="mt-8 flex flex-col xs:flex-row flex-wrap gap-3">
          <ButtonLink href={routePaths.projects}>View projects</ButtonLink>
          <ButtonLink href={routePaths.contact} variant="secondary">
            Hire me
          </ButtonLink>
        </div>

        <div className="mt-9 pt-1">
          <p className="mb-3 text-xs font-accent uppercase tracking-[0.2em] text-steel-400">
            Connect
          </p>
          <SocialLinksRow variant="primary" className="light-social-float" />
        </div>
      </div>

      <div className="hero-enter hero-enter-delay lg:col-span-5">
        <HomeLightHeroVisual />
      </div>
    </Container>
  </section>
);

export default HomeHeroSection;
