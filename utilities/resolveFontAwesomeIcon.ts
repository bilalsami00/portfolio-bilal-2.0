import type {
  IconDefinition,
  IconName,
  IconPrefix,
} from "@fortawesome/fontawesome-svg-core";
import {
  faFacebook,
  faGithub,
  faLinkedin,
  faNodeJs,
  faReact,
  faStackOverflow,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faArrowRight,
  faCalendarAlt,
  faFileDownload,
  faHeart,
  faTimes,
  faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

/** Brand icons referenced by config / components (string names → definitions). */
const brandIcons: Partial<Record<string, IconDefinition>> = {
  facebook: faFacebook,
  github: faGithub,
  linkedin: faLinkedin,
  "node-js": faNodeJs,
  react: faReact,
  "stack-overflow": faStackOverflow,
  twitter: faTwitter,
  youtube: faYoutube,
};

/** Solid icons referenced by config / components. */
const solidIcons: Partial<Record<string, IconDefinition>> = {
  "arrow-right": faArrowRight,
  "calendar-alt": faCalendarAlt,
  "file-download": faFileDownload,
  heart: faHeart,
  times: faTimes,
  "up-right-from-square": faUpRightFromSquare,
};

/**
 * Resolve a Font Awesome icon by prefix + name.
 * Passes IconDefinition objects directly so SSR and client render match
 * (avoids broken library string lookups under Next.js).
 */
export const resolveFontAwesomeIcon = (
  prefix: IconPrefix | undefined,
  name: IconName | string | undefined
): IconDefinition | null => {
  if (!name) return null;
  const pack = prefix === "fas" ? solidIcons : brandIcons;
  return pack[name] ?? null;
};
