import { skillGroups } from "../../data/skills";
import Container from "../shared/Container";
import RevealOnScroll from "../shared/RevealOnScroll";
import SectionHeading from "../shared/SectionHeading";
import SkillIcon from "../shared/SkillIcon";
import PlaceholderBadge from "../shared/PlaceholderBadge";

const HomeSkillsSection = () => (
  <section
    className="py-16 sm:py-20 bg-ink-950/50"
    aria-labelledby="skills-title"
  >
    <Container>
      <RevealOnScroll>
        <SectionHeading
          eyebrow="Skills & technologies"
          title="The arsenal"
          description="Grouped by discipline. Icons use the project's existing SVG set where available."
          align="center"
        />
      </RevealOnScroll>

      <div className="mt-12 space-y-8">
        {skillGroups.map((group, index) => (
          <RevealOnScroll
            key={group.id}
            delayClass={`reveal-delay-${(index % 4) + 1}`}
          >
            <div className="ink-panel p-5 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
                <div>
                  <h3 className="font-display text-2xl text-parchment-100 font-bold">
                    {group.title}
                  </h3>
                  <p className="mt-1 text-sm text-parchment-500">
                    {group.description}
                  </p>
                </div>
              </div>

              <ul className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {group.skills.map((skill) => {
                  const isPlaceholder = skill.name.includes("[");
                  return (
                    <li
                      key={skill.id}
                      className="flex flex-col items-start gap-3 border border-steel-700/60 bg-ink-800/50 p-3 sm:p-4"
                    >
                      <SkillIcon iconKey={skill.iconKey} className="h-7 w-7" />
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-parchment-200 font-medium leading-snug">
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
