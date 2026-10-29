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
 * Technology icons for The Arsenal and related skill lists.
 * Brand marks are locally hosted SVGs; abstract skills use bundled Font Awesome.
 */
const SkillIcon = ({
  iconKey,
  className = "h-8 w-8",
  title,
}: SkillIconProps) => {
  const { isDark, isReady } = useTheme();
  const definition = resolveSkillIcon(iconKey);
  const preferDarkAsset = !isReady || isDark;

  if (definition.source === "local") {
    const src =
      preferDarkAsset && definition.srcDark
        ? definition.srcDark
        : definition.src;

    return (
      <img
        src={src}
        alt={title ? `${title} icon` : ""}
        width={32}
        height={32}
        decoding="async"
        aria-hidden={title ? undefined : true}
        title={title}
        className={`${className} max-h-full max-w-full object-contain`}
      />
    );
  }

  if (definition.source === "fontawesome") {
    const icon = resolveFontAwesomeIcon(
      definition.prefix ?? "fas",
      definition.name
    );
    if (!icon)
      return <GenericFallbackIcon className={className} title={title} />;

    return (
      <FontAwesomeIcon
        icon={icon}
        className={`${className} text-crimson-400`}
        aria-hidden={title ? undefined : true}
        title={title}
      />
    );
  }

  return <GenericFallbackIcon className={className} title={title} />;
};

export default SkillIcon;
