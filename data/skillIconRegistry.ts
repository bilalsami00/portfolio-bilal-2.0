/**
 * Technology icon sources for skill / capability lists.
 * Brand marks are local Simple Icons (or classic Simple Icons) SVGs under
 * /public/icons/tech. Generic capabilities use the bundled Font Awesome set.
 */

export type SkillIconDefinition =
  | {
      source: "local";
      /** Path under `public/`, e.g. `/icons/tech/react.svg` */
      src: string;
      /** Optional light-on-dark variant for near-black brand marks */
      srcDark?: string;
    }
  | { source: "fontawesome"; name: string; prefix?: "fas" | "fab" }
  | { source: "none" };

/**
 * Maps portfolio `iconKey` values to local assets or Font Awesome glyphs.
 * Brand SVG color values match Simple Icons / official brand guidelines.
 */
export const skillIconRegistry: Record<string, SkillIconDefinition> = {
  // —— Brand logos (local Simple Icons SVGs) ——
  react: { source: "local", src: "/icons/tech/react.svg" },
  javascript: { source: "local", src: "/icons/tech/javascript.svg" },
  next: {
    source: "local",
    src: "/icons/tech/nextjs.svg",
    srcDark: "/icons/tech/nextjs-light.svg",
  },
  nextjs: {
    source: "local",
    src: "/icons/tech/nextjs.svg",
    srcDark: "/icons/tech/nextjs-light.svg",
  },
  typescript: { source: "local", src: "/icons/tech/typescript.svg" },
  html: { source: "local", src: "/icons/tech/html5.svg" },
  html5: { source: "local", src: "/icons/tech/html5.svg" },
  css: { source: "local", src: "/icons/tech/css3.svg" },
  css3: { source: "local", src: "/icons/tech/css3.svg" },
  tailwind: { source: "local", src: "/icons/tech/tailwindcss.svg" },
  nodejs: { source: "local", src: "/icons/tech/nodedotjs.svg" },
  mongodb: { source: "local", src: "/icons/tech/mongodb.svg" },
  git: { source: "local", src: "/icons/tech/git.svg" },
  github: {
    source: "local",
    src: "/icons/tech/github.svg",
    srcDark: "/icons/tech/github-light.svg",
  },
  express: {
    source: "local",
    src: "/icons/tech/express.svg",
    srcDark: "/icons/tech/express-light.svg",
  },
  firebase: { source: "local", src: "/icons/tech/firebase.svg" },
  mysql: { source: "local", src: "/icons/tech/mysql.svg" },
  dotnet: { source: "local", src: "/icons/tech/dotnet.svg" },
  vite: { source: "local", src: "/icons/tech/vite.svg" },
  redux: { source: "local", src: "/icons/tech/redux.svg" },
  wordpress: { source: "local", src: "/icons/tech/wordpress.svg" },
  antd: { source: "local", src: "/icons/tech/antdesign.svg" },
  axios: { source: "local", src: "/icons/tech/axios.svg" },
  radix: {
    source: "local",
    src: "/icons/tech/radixui.svg",
    srcDark: "/icons/tech/radixui-light.svg",
  },
  shadcn: {
    source: "local",
    src: "/icons/tech/shadcnui.svg",
    srcDark: "/icons/tech/shadcnui-light.svg",
  },
  chartjs: { source: "local", src: "/icons/tech/chartdotjs.svg" },
  gsap: { source: "local", src: "/icons/tech/greensock.svg" },
  framer: { source: "local", src: "/icons/tech/framer.svg" },
  swiper: { source: "local", src: "/icons/tech/swiper.svg" },
  reacthookform: { source: "local", src: "/icons/tech/reacthookform.svg" },
  reactrouter: { source: "local", src: "/icons/tech/reactrouter.svg" },
  aws: { source: "local", src: "/icons/tech/amazonaws.svg" },
  openapi: { source: "local", src: "/icons/tech/openapiinitiative.svg" },

  // —— No official Simple Icons brand mark; local Font Awesome ——
  yup: { source: "fontawesome", name: "clipboard-check" },
  recharts: { source: "fontawesome", name: "chart-column" },
  // Capability / abstract skills
  rest: { source: "local", src: "/icons/tech/openapiinitiative.svg" },
  responsive: { source: "local", src: "/icons/tech/responsive.svg" },
  dashboards: { source: "fontawesome", name: "table-columns" },
  oop: { source: "fontawesome", name: "diagram-project" },
  database: { source: "fontawesome", name: "database" },
  performance: { source: "fontawesome", name: "gauge-high" },
  seo: { source: "fontawesome", name: "magnifying-glass" },
  // Service / interest rows that reuse stack brands or generics:
  frontend: { source: "local", src: "/icons/tech/react.svg" },
  backend: { source: "local", src: "/icons/tech/nodedotjs.svg" },
  web: {
    source: "local",
    src: "/icons/tech/nextjs.svg",
    srcDark: "/icons/tech/nextjs-light.svg",
  },
  mobile: { source: "local", src: "/icons/tech/react.svg" },
  reading: { source: "fontawesome", name: "book-open" },
  photography: { source: "fontawesome", name: "camera" },
  traveling: { source: "fontawesome", name: "plane" },
};

export const resolveSkillIcon = (iconKey?: string): SkillIconDefinition => {
  if (!iconKey) return { source: "none" };
  return skillIconRegistry[iconKey] ?? { source: "none" };
};

/** True when a brand mark or generic fallback will render for this key. */
export const hasSkillIcon = (iconKey?: string): boolean => Boolean(iconKey);
