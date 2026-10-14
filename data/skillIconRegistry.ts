/**
 * Technology icon sources for skill lists.
 * Priority: Skill Icons (skillicons.dev) → Simple Icons → none (never invent brands).
 */

export type SkillIconDefinition =
  | { source: "skillicons"; ids: string[] }
  | { source: "simpleicons"; slug: string; color: string }
  | { source: "none" };

/**
 * Maps portfolio `iconKey` values to official icon identifiers.
 * Skill Icons IDs come from https://skillicons.dev/ (Icons List).
 * Simple Icons slugs/colors come from https://simpleicons.org/.
 */
export const skillIconRegistry: Record<string, SkillIconDefinition> = {
  // —— Skill Icons ——
  react: { source: "skillicons", ids: ["react"] },
  next: { source: "skillicons", ids: ["nextjs"] },
  nextjs: { source: "skillicons", ids: ["nextjs"] },
  typescript: { source: "skillicons", ids: ["ts"] },
  html: { source: "skillicons", ids: ["html"] },
  css: { source: "skillicons", ids: ["css"] },
  "html-css": { source: "skillicons", ids: ["html", "css"] },
  tailwind: { source: "skillicons", ids: ["tailwind"] },
  nodejs: { source: "skillicons", ids: ["nodejs"] },
  mongodb: { source: "skillicons", ids: ["mongodb"] },
  jest: { source: "skillicons", ids: ["jest"] },
  cypress: { source: "skillicons", ids: ["cypress"] },
  git: { source: "skillicons", ids: ["git"] },
  electron: { source: "skillicons", ids: ["electron"] },
  vercel: { source: "skillicons", ids: ["vercel"] },

  // —— Simple Icons fallbacks (no Skill Icons match) ——
  // https://simpleicons.org/icons/reactnative/
  "react-native": {
    source: "simpleicons",
    slug: "reactnative",
    color: "61DAFB",
  },

  // —— No authentic brand mark (placeholders / non-brand concepts) ——
  backend: { source: "none" },
  cms: { source: "none" },
  cloud: { source: "none" },
  frontend: { source: "none" },
  mobile: { source: "none" },
  performance: { source: "none" },
  rest: { source: "none" },
  seo: { source: "none" },
  testing: { source: "none" },
  tools: { source: "none" },
  uiux: { source: "none" },
  web: { source: "none" },
};

export const resolveSkillIcon = (iconKey?: string): SkillIconDefinition => {
  if (!iconKey) return { source: "none" };
  return skillIconRegistry[iconKey] ?? { source: "none" };
};
