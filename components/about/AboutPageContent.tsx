import {
  aboutPreview,
  currentFocusItems,
  developmentPhilosophy,
  engineeringIdentity,
  funFacts,
  languagesSpoken,
  siteIdentity,
} from "../../data/site";
import { experienceEntries } from "../../data/experience";
import { certificationEntries, educationEntries } from "../../data/education";
import { skillGroups } from "../../data/skills";
import { interestItems } from "../../data/interests";
import Container from "../shared/Container";
import RevealOnScroll from "../shared/RevealOnScroll";
import SectionHeading from "../shared/SectionHeading";
import PlaceholderBadge from "../shared/PlaceholderBadge";
import TechTag from "../shared/TechTag";
import SkillIcon from "../shared/SkillIcon";
import ContactCtaBanner from "../shared/ContactCtaBanner";
import SocialLinksRow from "../shared/SocialLinksRow";

/**
 * Complete interactive professional profile for the About route.
 */
const AboutPageContent = () => (
  <>
    <section
      className="pt-12 pb-12 sm:pt-16 sm:pb-16"
      aria-labelledby="about-hero-title"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <RevealOnScroll className="lg:col-span-7">
            <p className="section-eyebrow">About</p>
            <div className="crimson-mark mt-4 mb-5" />
            <h1
              id="about-hero-title"
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-parchment-100"
            >
              {siteIdentity.fullName}
            </h1>
            <p className="mt-4 text-xl text-crimson-300 font-accent tracking-wide">
              {siteIdentity.professionalTitle}
            </p>
            <p className="mt-6 max-w-2xl text-parchment-400 text-base sm:text-lg leading-relaxed">
              {aboutPreview.summary}
            </p>
            <SocialLinksRow variant="all" className="mt-8" />
          </RevealOnScroll>

          <RevealOnScroll delayClass="reveal-delay-2" className="lg:col-span-5">
            <div className="relative">
              <div
                className="absolute -inset-2 border border-crimson-800/40"
                aria-hidden
              />
              <img
                src={siteIdentity.profileImage}
                alt={siteIdentity.fullName}
                className="relative aspect-[4/5] w-full object-cover"
              />
            </div>
          </RevealOnScroll>
        </div>
      </Container>
    </section>

    <section className="py-14 sm:py-16" aria-labelledby="personal-intro-title">
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Personal introduction"
            title="Who I am in practice"
            description={siteIdentity.introduction}
          />
          <p className="mt-5 max-w-3xl text-parchment-400 leading-relaxed">
            {siteIdentity.tagline} I value readable systems, deliberate
            interfaces, and delivery that respects the people who will maintain
            the work next.
          </p>
        </RevealOnScroll>
      </Container>
    </section>

    <section
      className="py-14 sm:py-16 bg-ink-950/40"
      aria-labelledby="engineering-identity-title"
    >
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Engineering identity"
            title={engineeringIdentity.heading}
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {engineeringIdentity.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="ink-panel p-6 text-parchment-300 leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </RevealOnScroll>
      </Container>
    </section>

    <section className="py-14 sm:py-16" aria-labelledby="career-journey-title">
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Career journey"
            title="How the path is framed"
            description="A narrative overview of growth themes. Detailed roles live in the experience timeline below."
          />
          <div className="mt-8 ink-panel p-6 sm:p-8 max-w-3xl">
            <p className="text-parchment-300 leading-relaxed">
              The journey moves from fundamentals and feature delivery toward
              ownership of architecture, cross-platform product thinking, and
              quality practices. Replace the placeholder roles with verified
              employment to make this section recruiter-ready.
            </p>
          </div>
        </RevealOnScroll>
      </Container>
    </section>

    <section
      className="py-14 sm:py-16 bg-ink-950/40"
      aria-labelledby="experience-title"
    >
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Professional experience"
            title="Roles & ownership"
            description="Explicit placeholders until real company history is provided."
          />
        </RevealOnScroll>
        <div className="mt-10 space-y-5">
          {experienceEntries.map((entry, index) => (
            <RevealOnScroll
              key={entry.id}
              delayClass={`reveal-delay-${(index % 3) + 1}`}
            >
              <article className="ink-panel p-6 sm:p-7">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-accent uppercase tracking-[0.18em] text-steel-400">
                    {entry.startDate} — {entry.endDate}
                  </span>
                  {entry.isPlaceholder && <PlaceholderBadge />}
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-parchment-100 font-bold">
                  {entry.role}
                </h3>
                <p className="mt-1 text-crimson-300">
                  {entry.company} · {entry.location}
                </p>
                <p className="mt-3 text-parchment-400 leading-relaxed">
                  {entry.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.technologies.map((tech) => (
                    <TechTag key={`${entry.id}-${tech}`} label={tech} />
                  ))}
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>

    <section className="py-14 sm:py-16" aria-labelledby="education-title">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <RevealOnScroll>
              <SectionHeading eyebrow="Education" title="Academic background" />
            </RevealOnScroll>
            <div className="mt-8 space-y-4">
              {educationEntries.map((entry) => (
                <RevealOnScroll key={entry.id} className="ink-panel p-6">
                  {entry.isPlaceholder && (
                    <div className="mb-3">
                      <PlaceholderBadge />
                    </div>
                  )}
                  <h3 className="font-display text-xl text-parchment-100 font-bold">
                    {entry.degree}
                  </h3>
                  <p className="mt-1 text-crimson-300">{entry.institution}</p>
                  <p className="text-sm text-steel-400 mt-1">
                    {entry.location} · {entry.startDate} — {entry.endDate}
                  </p>
                  <p className="mt-3 text-sm text-parchment-400">
                    {entry.description}
                  </p>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          <div>
            <RevealOnScroll>
              <SectionHeading eyebrow="Certifications" title="Credentials" />
            </RevealOnScroll>
            <div className="mt-8 space-y-4">
              {certificationEntries.map((cert) => (
                <RevealOnScroll key={cert.id} className="ink-panel p-6">
                  {cert.isPlaceholder && (
                    <div className="mb-3">
                      <PlaceholderBadge />
                    </div>
                  )}
                  <h3 className="font-display text-lg text-parchment-100 font-bold">
                    {cert.name}
                  </h3>
                  <p className="mt-1 text-sm text-parchment-400">
                    {cert.issuer} · {cert.year}
                  </p>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>

    <section
      className="py-14 sm:py-16 bg-ink-950/40"
      aria-labelledby="tech-arsenal-title"
    >
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Skills"
            title="Tech arsenal"
            description="The same grouped stack presented on the home page, kept here for profile completeness."
          />
        </RevealOnScroll>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {skillGroups.map((group) => (
            <RevealOnScroll key={group.id} className="ink-panel p-5">
              <h3 className="font-display text-lg text-parchment-100 font-bold">
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill.id}
                    className="inline-flex items-center gap-2 border border-steel-700 px-2.5 py-1.5 text-sm text-parchment-300"
                  >
                    <SkillIcon iconKey={skill.iconKey} className="h-4 w-4" />
                    {skill.name}
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>

    <section className="py-14 sm:py-16" aria-labelledby="philosophy-title">
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Development philosophy"
            title="Principles that survive deadlines"
          />
        </RevealOnScroll>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {developmentPhilosophy.map((principle, index) => (
            <RevealOnScroll
              key={principle.id}
              delayClass={`reveal-delay-${(index % 4) + 1}`}
              className="ink-panel ink-panel-hover p-6"
            >
              <p className="font-accent text-xs uppercase tracking-[0.2em] text-crimson-400">
                0{index + 1}
              </p>
              <h3 className="mt-3 font-display text-xl text-parchment-100 font-bold">
                {principle.title}
              </h3>
              <p className="mt-3 text-sm text-parchment-400 leading-relaxed">
                {principle.description}
              </p>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>

    <section
      className="py-14 sm:py-16 bg-ink-950/40"
      aria-labelledby="about-focus-title"
    >
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Current focus"
            title="What I am sharpening now"
          />
        </RevealOnScroll>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {currentFocusItems.map((item) => (
            <RevealOnScroll key={item.id} className="ink-panel p-5">
              <h3 className="font-display text-lg text-parchment-100 font-bold">
                {item.label}
              </h3>
              <p className="mt-2 text-sm text-parchment-400">
                {item.description}
              </p>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>

    <section className="py-14 sm:py-16" aria-labelledby="about-interests-title">
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Personal interests"
            title="Signals outside the sprint"
          />
        </RevealOnScroll>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {interestItems.map((item) => (
            <RevealOnScroll key={item.id} className="ink-panel p-5">
              <h3 className="font-display text-lg text-parchment-100 font-bold">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-parchment-400">
                {item.description}
              </p>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>

    <section
      className="py-14 sm:py-16 bg-ink-950/40"
      aria-labelledby="languages-title"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <RevealOnScroll>
              <SectionHeading
                eyebrow="Languages"
                title="Communication"
                description="Proficiency labels are placeholders — update with accurate levels."
              />
            </RevealOnScroll>
            <ul className="mt-8 space-y-3">
              {languagesSpoken.map((lang) => (
                <li
                  key={lang.id}
                  className="ink-panel p-5 flex flex-col sm:flex-row sm:justify-between gap-2"
                >
                  <span className="font-display text-parchment-100 font-semibold">
                    {lang.language}
                  </span>
                  <span className="text-sm text-parchment-500 flex items-center gap-2">
                    {lang.proficiency}
                    <PlaceholderBadge />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <RevealOnScroll>
              <SectionHeading eyebrow="Fun facts" title="Small truths" />
            </RevealOnScroll>
            <ul className="mt-8 space-y-3">
              {funFacts.map((fact) => (
                <li key={fact.id} className="ink-panel p-5">
                  <h3 className="font-accent text-xs uppercase tracking-[0.18em] text-crimson-400">
                    {fact.label}
                  </h3>
                  <p className="mt-2 text-sm text-parchment-400">
                    {fact.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>

    <ContactCtaBanner
      eyebrow="Work together"
      title="If this profile resonates, let’s talk."
    />
  </>
);

export default AboutPageContent;
