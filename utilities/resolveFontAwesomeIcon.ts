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
  faBookOpen,
  faCalendarAlt,
  faCamera,
  faChartColumn,
  faCode,
  faCubes,
  faDatabase,
  faEnvelope,
  faFileDownload,
  faGaugeHigh,
  faHeart,
  faMagnifyingGlass,
  faMobileScreen,
  faPlane,
  faPlug,
  faTableColumns,
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
  "book-open": faBookOpen,
  "calendar-alt": faCalendarAlt,
  camera: faCamera,
  "chart-column": faChartColumn,
  code: faCode,
  cubes: faCubes,
  database: faDatabase,
  envelope: faEnvelope,
  "file-download": faFileDownload,
  "gauge-high": faGaugeHigh,
  heart: faHeart,
  "magnifying-glass": faMagnifyingGlass,
  "mobile-screen": faMobileScreen,
  plane: faPlane,
  plug: faPlug,
  "table-columns": faTableColumns,
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
