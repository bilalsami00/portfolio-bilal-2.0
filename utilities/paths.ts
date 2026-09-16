/**
 * Application route definitions.
 * Keep href values as professional, stable pathnames (not hash anchors).
 */

export const homePath = "/";
export const projectsPath = "/projects";
export const aboutPath = "/about";
export const contactPath = "/contact";

export type AppPath = {
  href: string;
  title: string;
};

const paths: AppPath[] = [
  {
    href: homePath,
    title: "Home",
  },
  {
    href: projectsPath,
    title: "Projects",
  },
  {
    href: aboutPath,
    title: "About",
  },
  {
    href: contactPath,
    title: "Contact",
  },
];

export default paths;
