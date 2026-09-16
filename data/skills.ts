import type { SkillGroup } from "./types";

/**
 * Skills grounded in technologies used across this portfolio stack.
 */

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    description: "Interfaces, component systems, and client-side architecture.",
    skills: [
      { id: "skill-react", name: "React", iconKey: "react" },
      { id: "skill-next", name: "Next.js", iconKey: "next" },
      { id: "skill-typescript-fe", name: "TypeScript", iconKey: "typescript" },
      { id: "skill-html-css", name: "HTML / CSS", iconKey: "frontend" },
      { id: "skill-tailwind", name: "Tailwind CSS", iconKey: "frontend" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    description: "APIs, services, and server-side application logic.",
    skills: [
      { id: "skill-node", name: "Node.js", iconKey: "nodejs" },
      { id: "skill-typescript-be", name: "TypeScript", iconKey: "typescript" },
      { id: "skill-rest", name: "REST APIs", iconKey: "backend" },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    description: "Persistence and document-oriented data modeling.",
    skills: [{ id: "skill-mongo", name: "MongoDB", iconKey: "mongodb" }],
  },
  {
    id: "tools",
    title: "Tools",
    description: "Quality, packaging, and day-to-day engineering tooling.",
    skills: [
      { id: "skill-jest", name: "Jest", iconKey: "jest" },
      { id: "skill-cypress", name: "Cypress", iconKey: "testing" },
      { id: "skill-git", name: "Git", iconKey: "tools" },
      { id: "skill-electron", name: "Electron", iconKey: "electron" },
    ],
  },
  {
    id: "cms",
    title: "CMS",
    description:
      "Content workflows and admin consoles (expand with your real CMS stack).",
    skills: [
      {
        id: "skill-cms-placeholder",
        name: "[CMS / Headless CMS — replace]",
        iconKey: "cms",
      },
    ],
  },
  {
    id: "cloud",
    title: "Cloud / Deployment",
    description: "Shipping and hosting surfaces used with this stack.",
    skills: [
      { id: "skill-vercel", name: "Vercel", iconKey: "cloud" },
      {
        id: "skill-cloud-placeholder",
        name: "[Additional cloud provider — replace]",
        iconKey: "cloud",
      },
    ],
  },
  {
    id: "other",
    title: "Other Technologies",
    description: "Cross-platform and complementary capabilities.",
    skills: [
      {
        id: "skill-react-native",
        name: "React Native",
        iconKey: "react-native",
      },
      { id: "skill-responsive", name: "Responsive Design", iconKey: "uiux" },
      { id: "skill-seo-basics", name: "Technical SEO", iconKey: "seo" },
    ],
  },
];
