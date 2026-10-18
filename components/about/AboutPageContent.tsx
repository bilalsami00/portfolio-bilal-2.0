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
      className="pt-10 pb-16 sm:pt-14 sm:pb-20 md:pt-16 md:pb-24"
      aria-labelledby="about-hero-title"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="hero-enter lg:col-span-7">
            <p className="section-eyebrow">About</p>
            <div className="crimson-mark mt-3.5 mb-5 sm:mt-4 sm:mb-6" />
            <h1
              id="about-hero-title"
              className="font-display text-4xl xs:text-5xl sm:text-5xl md:text-6xl font-bold text-parchment-100 leading-[1.05] tracking-tight text-balance"
            >
              {siteIdentity.fullName}
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-crimson-300 font-accent tracking-wide">
              {siteIdentity.professionalTitle}
            </p>
            <p className="mt-6 max-w-2xl text-parchment-400 text-base sm:text-lg leading-relaxed text-pretty">
              {aboutPreview.summary}
            </p>
            <SocialLinksRow variant="all" className="mt-8 sm:mt-9" />
          </div>

          <div className="hero-enter hero-enter-delay lg:col-span-5">
            <div className="relative max-w-md mx-auto lg:max-w-none lg:mx-0">
              <div
                className="absolute -inset-2 border border-crimson-700/30 translate-x-1.5 translate-y-1.5 sm:-inset-3 sm:translate-x-2 sm:translate-y-2"
                aria-hidden
              />
              <div className="relative overflow-hidden ink-panel">
                <img
                  src={siteIdentity.profileImage}
                  alt={siteIdentity.fullName}
                  className="aspect-[4/5] w-full object-cover grayscale-[20%] contrast-[1.05]"
                  width={640}
                  height={800}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <section
      className="py-16 sm:py-20 md:py-24"
      aria-labelledby="personal-intro-title"
    >
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Personal introduction"
            title="Who I am in practice"
            description={siteIdentity.introduction}
          />
          <p className="mt-5 max-w-3xl text-parchment-400 leading-relaxed">
            {siteIdentity.tagline}
          </p>
        </RevealOnScroll>
      </Container>
    </section>

    <section
      className="py-16 sm:py-20 md:py-24 bg-ink-950/40"
      aria-labelledby="engineering-identity-title"
    >
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Engineering identity"
            title={engineeringIdentity.heading}
          />
          <div className="mt-10 sm:mt-12 grid gap-4 sm:gap-5 md:grid-cols-2">
            {engineeringIdentity.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="ink-panel p-6 sm:p-7 text-parchment-300 leading-relaxed h-full"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </RevealOnScroll>
      </Container>
    </section>

    <section
      className="py-16 sm:py-20 md:py-24"
      aria-labelledby="career-journey-title"
    >
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Career journey"
            title="How the path is framed"
            description="Frontend work at Maze Digital, with earlier marketing, customer service, and data roles."
          />
          <div className="mt-10 sm:mt-12 ink-panel p-6 sm:p-8 max-w-3xl space-y-4">
            <p className="text-parchment-300 leading-relaxed">
              I joined Maze Digital in January 2025 as a Frontend Developer and
              still work there full-time. The work is Next.js, React,
              JavaScript, and Tailwind CSS: responsive marketing pages, landing
              pages, and web dashboards. Each case study describes the product,
              not a personal list of every feature.
            </p>
            <p className="text-parchment-300 leading-relaxed">
              Earlier work includes a three-month e-commerce marketing
              internship in 2023, three months as a Spectrum call center agent,
              and contract data entry and analysis. I also built an OLX-style
              learning project with React, Firebase Authentication, and
              Firestore.
            </p>
          </div>
        </RevealOnScroll>
      </Container>
    </section>

    <section
      className="py-16 sm:py-20 md:py-24 bg-ink-950/40"
      aria-labelledby="experience-title"
    >
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Professional experience"
            title="Roles"
            description="Current frontend role first, followed by earlier work."
          />
        </RevealOnScroll>
        <div className="mt-10 sm:mt-12 space-y-5">
          {experienceEntries.map((entry, index) => (
            <RevealOnScroll
              key={entry.id}
              delayClass={`reveal-delay-${(index % 3) + 1}`}
            >
              <article className="ink-panel p-6 sm:p-7">
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  {(entry.startDate || entry.endDate) && (
                    <span className="text-xs font-accent uppercase tracking-[0.18em] text-steel-400">
                      {entry.endDate
                        ? `${entry.startDate} — ${entry.endDate}`
                        : entry.startDate}
                    </span>
                  )}
                  {entry.isPlaceholder && <PlaceholderBadge />}
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-parchment-100 font-bold leading-snug">
                  {entry.role}
                </h3>
                {(entry.company || entry.location) && (
                  <p className="mt-1.5 text-crimson-300 font-accent text-sm tracking-wide">
                    {[entry.company, entry.location]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
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

    <section
      className="py-16 sm:py-20 md:py-24"
      aria-labelledby="education-title"
    >
      <Container>
        <div
          className={`grid gap-10 ${
            certificationEntries.length > 0 ? "lg:grid-cols-2 lg:gap-12" : ""
          }`}
        >
          <div>
            <RevealOnScroll>
              <SectionHeading eyebrow="Education" title="Academic background" />
            </RevealOnScroll>
            <div className="mt-8 sm:mt-10 space-y-4">
              {educationEntries.map((entry) => (
                <RevealOnScroll key={entry.id} className="ink-panel p-6 h-full">
                  {entry.isPlaceholder && (
                    <div className="mb-3">
                      <PlaceholderBadge />
                    </div>
                  )}
                  <h3 className="font-display text-xl text-parchment-100 font-bold leading-snug">
                    {entry.degree}
                  </h3>
                  <p className="mt-1.5 text-crimson-300">{entry.institution}</p>
                  <p className="text-sm text-steel-400 mt-1.5 leading-snug">
                    {entry.location} · {entry.startDate} — {entry.endDate}
                  </p>
                  <p className="mt-3 text-sm text-parchment-400 leading-relaxed">
                    {entry.description}
                  </p>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          {certificationEntries.length > 0 && (
            <div>
              <RevealOnScroll>
                <SectionHeading eyebrow="Certifications" title="Credentials" />
              </RevealOnScroll>
              <div className="mt-8 sm:mt-10 space-y-4">
                {certificationEntries.map((cert) => (
                  <RevealOnScroll
                    key={cert.id}
                    className="ink-panel p-6 h-full"
                  >
                    {cert.isPlaceholder && (
                      <div className="mb-3">
                        <PlaceholderBadge />
                      </div>
                    )}
                    <h3 className="font-display text-lg text-parchment-100 font-bold leading-snug">
                      {cert.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-parchment-400 leading-snug">
                      {cert.issuer} · {cert.year}
                    </p>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>

    <section
      className="py-16 sm:py-20 md:py-24 bg-ink-950/40"
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
        <div className="mt-10 sm:mt-12 grid gap-4 md:grid-cols-2">
          {skillGroups.map((group) => (
            <RevealOnScroll
              key={group.id}
              className="ink-panel p-5 sm:p-6 h-full"
            >
              <h3 className="font-display text-lg text-parchment-100 font-bold leading-snug">
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-3">
                {group.skills.map((skill) => (
                  <li
                    key={skill.id}
                    className="group inline-flex items-center gap-2 text-sm text-parchment-300"
                  >
                    <SkillIcon
                      iconKey={skill.iconKey}
                      className="h-6 w-6 shrink-0 transition-opacity duration-300 group-hover:opacity-85"
                    />
                    <span className="leading-snug transition-colors duration-300 group-hover:text-parchment-100">
                      {skill.name}
                    </span>
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>

    <section
      className="py-16 sm:py-20 md:py-24"
      aria-labelledby="philosophy-title"
    >
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Development philosophy"
            title="Principles that survive deadlines"
          />
        </RevealOnScroll>
        <div className="mt-10 sm:mt-12 grid gap-4 sm:grid-cols-2">
          {developmentPhilosophy.map((principle, index) => (
            <RevealOnScroll
              key={principle.id}
              delayClass={`reveal-delay-${(index % 4) + 1}`}
              className="ink-panel ink-panel-hover p-6 h-full"
            >
              <p className="font-accent text-xs uppercase tracking-[0.2em] text-crimson-400">
                0{index + 1}
              </p>
              <h3 className="mt-3 font-display text-xl text-parchment-100 font-bold leading-snug">
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
      className="py-16 sm:py-20 md:py-24 bg-ink-950/40"
      aria-labelledby="about-focus-title"
    >
      <Container>
        <RevealOnScroll>
          <SectionHeading eyebrow="Current focus" title="Current stack" />
        </RevealOnScroll>
        <div className="mt-10 sm:mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {currentFocusItems.map((item) => (
            <RevealOnScroll
              key={item.id}
              className="ink-panel ink-panel-hover p-5 sm:p-6 h-full"
            >
              <h3 className="font-display text-lg text-parchment-100 font-bold leading-snug">
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

    {interestItems.length > 0 && (
      <section
        className="py-16 sm:py-20 md:py-24"
        aria-labelledby="about-interests-title"
      >
        <Container>
          <RevealOnScroll>
            <SectionHeading
              eyebrow="Personal interests"
              title="Outside the work"
            />
          </RevealOnScroll>
          <div className="mt-10 sm:mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {interestItems.map((item) => (
              <RevealOnScroll
                key={item.id}
                className="ink-panel ink-panel-hover flex h-full flex-col p-6 sm:p-7"
              >
                <SkillIcon iconKey={item.iconKey} className="h-8 w-8" />
                <h3 className="mt-4 font-display text-lg text-parchment-100 font-bold leading-snug">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-parchment-400 leading-relaxed">
                  {item.description}
                </p>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>
    )}

    {(languagesSpoken.length > 0 || funFacts.length > 0) && (
      <section
        className="py-16 sm:py-20 md:py-24 bg-ink-950/40"
        aria-labelledby="languages-title"
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            {languagesSpoken.length > 0 && (
              <div>
                <RevealOnScroll>
                  <SectionHeading eyebrow="Languages" title="Communication" />
                </RevealOnScroll>
                <ul className="mt-8 sm:mt-10 space-y-3">
                  {languagesSpoken.map((lang) => (
                    <li
                      key={lang.id}
                      className="ink-panel p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                    >
                      <span className="font-display text-parchment-100 font-semibold leading-snug">
                        {lang.language}
                      </span>
                      {lang.proficiency ? (
                        <span className="text-sm text-parchment-500">
                          {lang.proficiency}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {funFacts.length > 0 && (
              <div>
                <RevealOnScroll>
                  <SectionHeading eyebrow="Strengths" title="Working style" />
                </RevealOnScroll>
                <ul className="mt-8 sm:mt-10 space-y-3">
                  {funFacts.map((fact) => (
                    <li key={fact.id} className="ink-panel p-5 sm:p-6">
                      <h3 className="font-accent text-xs uppercase tracking-[0.18em] text-crimson-400">
                        {fact.label}
                      </h3>
                      <p className="mt-2.5 text-sm text-parchment-400 leading-relaxed">
                        {fact.detail}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Container>
      </section>
    )}

    <ContactCtaBanner eyebrow="Contact" title="Questions about this profile?" />
  </>
);

export default AboutPageContent;
