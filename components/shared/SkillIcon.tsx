import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { resolveSkillIcon } from "../../data/skillIconRegistry";
import { resolveFontAwesomeIcon } from "../../utilities/resolveFontAwesomeIcon";
import { useTheme } from "./ThemeProvider";

type SkillIconProps = {
  iconKey?: string;
  className?: string;
  /** Accessible name when no adjacent text label identifies the technology */
  title?: string;
};

const skillIconsUrl = (ids: string[], theme: "dark" | "light") =>
  `https://skillicons.dev/icons?i=${ids.join(",")}&theme=${theme}`;

const simpleIconsUrl = (slug: string, color: string) =>
  `https://cdn.simpleicons.org/${slug}/${color}`;

/** Previous portfolio fallback for non-brand / placeholder skills. */
const GenericFallbackIcon = ({
  className,
  title,
}: {
  className: string;
  title?: string;
}) => {
  const icon = resolveFontAwesomeIcon("fas", "code");
  if (!icon) return null;

  return (
    <FontAwesomeIcon
      icon={icon}
      className={`${className} text-crimson-400`}
      aria-hidden={title ? undefined : true}
      title={title}
    />
  );
};

/**
 * Official technology icons via Skill Icons, with Simple Icons fallback.
 * Generic skills reuse the existing Font Awesome code glyph (never left blank).
 */
const SkillIcon = ({
  iconKey,
  className = "h-8 w-8",
  title,
}: SkillIconProps) => {
  const { isDark, isReady } = useTheme();
  const definition = resolveSkillIcon(iconKey);
  const skillTheme = !isReady || isDark ? "dark" : "light";

  if (definition.source === "skillicons") {
    const { ids } = definition;
    const isPair = ids.length > 1;

    return (
      <span
        className={`inline-flex items-center shrink-0 ${isPair ? "gap-1" : ""}`}
        aria-hidden={title ? undefined : true}
        title={title}
      >
        {ids.map((id) => (
          <img
            key={id}
            src={skillIconsUrl([id], skillTheme)}
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

  return <GenericFallbackIcon className={className} title={title} />;
};

export default SkillIcon;
