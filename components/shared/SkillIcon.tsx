import { resolveSkillIcon } from "../../data/skillIconRegistry";

type SkillIconProps = {
  iconKey?: string;
  className?: string;
  /** Accessible name when no adjacent text label identifies the technology */
  title?: string;
};

const skillIconsUrl = (ids: string[]) =>
  `https://skillicons.dev/icons?i=${ids.join(",")}&theme=dark`;

const simpleIconsUrl = (slug: string, color: string) =>
  `https://cdn.simpleicons.org/${slug}/${color}`;

/**
 * Official technology icons via Skill Icons, with Simple Icons fallback.
 * Decorative by default when a text label already names the technology.
 */
const SkillIcon = ({
  iconKey,
  className = "h-6 w-6",
  title,
}: SkillIconProps) => {
  const definition = resolveSkillIcon(iconKey);

  if (definition.source === "skillicons") {
    const { ids } = definition;
    const isPair = ids.length > 1;

    return (
      <span
        className={`inline-flex items-center ${isPair ? "gap-1" : ""}`}
        aria-hidden={title ? undefined : true}
        title={title}
      >
        {ids.map((id) => (
          <img
            key={id}
            src={skillIconsUrl([id])}
            alt={title ? `${title} icon` : ""}
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            className={`${className} object-contain`}
          />
        ))}
      </span>
    );
  }

  if (definition.source === "simpleicons") {
    return (
      <img
        src={simpleIconsUrl(definition.slug, definition.color)}
        alt={title ? `${title} icon` : ""}
        width={48}
        height={48}
        loading="lazy"
        decoding="async"
        aria-hidden={title ? undefined : true}
        title={title}
        className={`${className} object-contain`}
      />
    );
  }

  return null;
};

export default SkillIcon;
