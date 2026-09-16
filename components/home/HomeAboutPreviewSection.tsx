import { aboutPreview, siteIdentity } from "../../data/site";
import { ButtonLink } from "../shared/Button";
import Container from "../shared/Container";
import RevealOnScroll from "../shared/RevealOnScroll";
import SectionHeading from "../shared/SectionHeading";

const HomeAboutPreviewSection = () => (
  <section className="py-16 sm:py-20" aria-labelledby="about-preview-title">
    <Container>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
        <RevealOnScroll className="lg:col-span-5">
          <div className="relative">
            <div
              className="absolute -inset-2 border border-steel-700/50"
              aria-hidden
            />
            <img
              src="/assets/images/programmer.png"
              alt=""
              className="relative w-full object-contain opacity-90"
              width={560}
              height={560}
            />
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayClass="reveal-delay-2" className="lg:col-span-7">
          <SectionHeading
            eyebrow="About"
            title={aboutPreview.heading}
            description={aboutPreview.summary}
          />
          <p className="mt-5 text-parchment-400 leading-relaxed max-w-2xl">
            {siteIdentity.tagline} Based on publicly configured profile details
            for {siteIdentity.fullName}, this portfolio emphasizes web, mobile,
            and full-stack craftsmanship with a dark, disciplined visual
            language.
          </p>
          <div className="mt-8">
            <ButtonLink href={aboutPreview.ctaHref} variant="secondary">
              {aboutPreview.ctaLabel}
            </ButtonLink>
          </div>
        </RevealOnScroll>
      </div>
    </Container>
  </section>
);

export default HomeAboutPreviewSection;
