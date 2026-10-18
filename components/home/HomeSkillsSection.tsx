import { skillGroups } from "../../data/skills";
import Container from "../shared/Container";
import RevealOnScroll from "../shared/RevealOnScroll";
import SectionHeading from "../shared/SectionHeading";
import SkillIcon from "../shared/SkillIcon";
import PlaceholderBadge from "../shared/PlaceholderBadge";

const HomeSkillsSection = () => (
  <section
    className="py-16 sm:py-20 md:py-24 bg-ink-950/50"
    aria-labelledby="skills-title"
  >
    <Container>
      <RevealOnScroll>
        <SectionHeading
          eyebrow="Skills & technologies"
          title="The arsenal"
          description="Next.js, React, JavaScript, and Tailwind CSS first, then dashboards, APIs, and the other tools used in these projects."
          align="center"
        />
      </RevealOnScroll>

      <div className="mt-10 sm:mt-12 space-y-6 sm:space-y-8">
        {skillGroups.map((group, index) => (
          <RevealOnScroll
            key={group.id}
            delayClass={`reveal-delay-${(index % 4) + 1}`}
          >
            <div className="ink-panel p-5 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5 sm:mb-6">
                <div className="max-w-2xl">
                  <h3 className="font-display text-2xl text-parchment-100 font-bold leading-snug">
                    {group.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-parchment-500 leading-relaxed">
                    {group.description}
                  </p>
                </div>
              </div>

              <ul className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-5">
                {group.skills.map((skill) => {
                  const isPlaceholder = skill.name.includes("[");

                  return (
                    <li
                      key={skill.id}
                      className="group flex items-center gap-3 min-h-[2.75rem]"
                    >
                      <SkillIcon
                        iconKey={skill.iconKey}
                        className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-opacity duration-300 group-hover:opacity-85"
                      />
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-sm text-parchment-200 font-medium leading-snug break-words transition-colors duration-300 group-hover:text-parchment-100">
                          {skill.name}
                        </span>
                        {isPlaceholder && <PlaceholderBadge />}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </Container>
  </section>
);

export default HomeSkillsSection;
