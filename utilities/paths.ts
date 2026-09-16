/**
 * Application route definitions (kept in sync with data/navigation.ts).
 */

export const homePath = "/";
export const projectsPath = "/projects";
export const aboutPath = "/about";
export const contactPath = "/contact";
export const missionControlPath = "/mission-control";
export const missionControlDashboardPath = "/mission-control/dashboard";

export type AppPath = {
  href: string;
  title: string;
};

const paths: AppPath[] = [
  { href: homePath, title: "Home" },
  { href: projectsPath, title: "Projects" },
  { href: aboutPath, title: "About" },
  { href: contactPath, title: "Contact" },
];

export default paths;
