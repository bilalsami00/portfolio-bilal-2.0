/**
 * Technology icon sources for skill / capability lists.
 * Priority: Skill Icons (skillicons.dev) → Simple Icons → none (never invent brands).
 */

export type SkillIconDefinition =
  | { source: "skillicons"; ids: string[] }
  | { source: "simpleicons"; slug: string; color: string }
  | { source: "none" };

/**
 * Maps portfolio `iconKey` values to official icon identifiers.
 * Skill Icons IDs: https://skillicons.dev/ (Icons List).
 * Simple Icons slugs/colors: https://simpleicons.org/.
 */
export const skillIconRegistry: Record<string, SkillIconDefinition> = {
  // —— Skill Icons ——
  react: { source: "skillicons", ids: ["react"] },
  javascript: { source: "skillicons", ids: ["js"] },
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
  express: { source: "skillicons", ids: ["express"] },
  firebase: { source: "skillicons", ids: ["firebase"] },
  mysql: { source: "skillicons", ids: ["mysql"] },
  dotnet: { source: "skillicons", ids: ["dotnet"] },
  vite: { source: "skillicons", ids: ["vite"] },
  redux: { source: "skillicons", ids: ["redux"] },
  wordpress: { source: "skillicons", ids: ["wordpress"] },
  antd: { source: "simpleicons", slug: "antdesign", color: "0170FE" },
  axios: { source: "simpleicons", slug: "axios", color: "5A29E4" },
  radix: { source: "simpleicons", slug: "radixui", color: "161618" },
  chartjs: { source: "simpleicons", slug: "chartdotjs", color: "FF6384" },
  recharts: { source: "none" },
  gsap: { source: "simpleicons", slug: "greensock", color: "88CE02" },
  framer: { source: "simpleicons", slug: "framer", color: "0055FF" },
  swiper: { source: "none" },
  reacthookform: { source: "none" },
  reactrouter: { source: "simpleicons", slug: "reactrouter", color: "CA4245" },
  aws: { source: "skillicons", ids: ["aws"] },
  electron: { source: "skillicons", ids: ["electron"] },
  vercel: { source: "skillicons", ids: ["vercel"] },
  // No dedicated RN id on Skill Icons; RN uses the React brand mark.
  // Simple Icons also retired `reactnative` (identical to React).
  "react-native": { source: "skillicons", ids: ["react"] },
  // Capability rows that name a concrete stack technology:
  frontend: { source: "skillicons", ids: ["react"] },
  backend: { source: "skillicons", ids: ["nodejs"] },
  web: { source: "skillicons", ids: ["nextjs"] },
  mobile: { source: "skillicons", ids: ["react"] },

  // —— No authentic brand mark (placeholders / non-brand concepts) ——
  cms: { source: "none" },
  cloud: { source: "none" },
  performance: { source: "none" },
  rest: { source: "none" },
  seo: { source: "none" },
  testing: { source: "none" },
  tools: { source: "none" },
  uiux: { source: "none" },
};

export const resolveSkillIcon = (iconKey?: string): SkillIconDefinition => {
  if (!iconKey) return { source: "none" };
  return skillIconRegistry[iconKey] ?? { source: "none" };
};

/** True when a brand mark or generic fallback will render for this key. */
export const hasSkillIcon = (iconKey?: string): boolean => Boolean(iconKey);
