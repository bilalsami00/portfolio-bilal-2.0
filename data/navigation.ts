import type { NavigationItem } from "./types";

export const primaryNavigation: NavigationItem[] = [
  { id: "nav-home", label: "Home", href: "/" },
  { id: "nav-projects", label: "Projects", href: "/projects" },
  { id: "nav-about", label: "About", href: "/about" },
  { id: "nav-contact", label: "Contact", href: "/contact" },
];

export const footerNavigation: NavigationItem[] = [
  ...primaryNavigation,
  {
    id: "nav-mission-control",
    label: "Mission Control",
    href: "/mission-control",
  },
];

export const routePaths = {
  home: "/",
  projects: "/projects",
  about: "/about",
  contact: "/contact",
  missionControl: "/mission-control",
  missionControlDashboard: "/mission-control/dashboard",
} as const;
