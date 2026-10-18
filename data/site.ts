import type {
  CurrentFocusItem,
  SiteIdentity,
  SiteSeo,
  SiteAvailability,
} from "./types";

/**
 * Core site identity for Muhammad Bilal Sami.
 * Facts follow the 2026-10-18 verified profile. Unconfirmed claims stay off the site.
 */

export const siteIdentity: SiteIdentity = {
  fullName: "Muhammad Bilal Sami",
  shortName: "Bilal Sami",
  professionalTitle: "Frontend Developer",
  tagline:
    "Frontend Developer at Maze Digital, building interfaces with Next.js, React, JavaScript, and Tailwind CSS.",
  introduction:
    "Frontend Developer working full-time at Maze Digital since January 2025. I focus on Next.js, React, JavaScript, and Tailwind CSS, with responsive marketing websites, multi-role admin portals, and API-connected interfaces. I graduated with a BS in Computer Science from the University of Karachi in 2023.",
  location: "Karachi, Pakistan",
  email: "muhammadbilalsami2000@gmail.com",
  phone: "+92 312 2559707",
  profileImage: "/assets/images/programmer.webp",
  logoImage: "/assets/images/programmer.webp",
  resumeUrl: "/resume/Updated_Full_CV.pdf",
  siteUrl: "https://bilalsami.vercel.app",
  siteName: "Bilal Sami",
};

export const siteAvailability: SiteAvailability = {
  statusLabel: "Employed full-time",
  statusDetail: "Frontend Developer at Maze Digital since January 2025.",
  isAvailableForWork: false,
};

export const siteSeo: SiteSeo = {
  defaultTitle: "Bilal Sami | Frontend Developer",
  titleTemplate: "%s | Bilal Sami",
  defaultDescription:
    "Portfolio of Muhammad Bilal Sami, a frontend developer at Maze Digital working with Next.js, React, JavaScript, and Tailwind CSS.",
  keywords: [
    "Bilal Sami",
    "Muhammad Bilal Sami",
    "Frontend Developer",
    "Next.js",
    "React",
    "JavaScript",
    "Tailwind CSS",
    "Maze Digital",
    "Portfolio",
  ],
  ogImage: "/assets/images/programmer.webp",
};

export const currentFocusItems: CurrentFocusItem[] = [
  {
    id: "focus-next",
    label: "Next.js",
    description:
      "Marketing sites and web dashboards built as Next.js frontends.",
  },
  {
    id: "focus-react",
    label: "React",
    description:
      "Component-based interfaces for public pages and authenticated admin views.",
  },
  {
    id: "focus-javascript",
    label: "JavaScript",
    description:
      "Day-to-day frontend implementation across the Maze Digital projects shown here.",
  },
  {
    id: "focus-tailwind",
    label: "Tailwind CSS",
    description: "Layout and styling for the web interfaces in this portfolio.",
  },
];

export const aboutPreview = {
  heading: "Frontend developer at Maze Digital.",
  summary:
    "Since January 2025 I have worked full-time as a Frontend Developer at Maze Digital in Karachi, building interfaces with Next.js, React, JavaScript, and Tailwind CSS.",
  ctaLabel: "Read the full profile",
  ctaHref: "/about",
};

export const engineeringIdentity = {
  heading: "How I work",
  paragraphs: [
    "I develop and maintain frontend interfaces for web applications. The case studies on this site describe product features, not a personal inventory of every screen I built.",
    "Next.js, React, JavaScript, and Tailwind CSS are the current focus, along with responsive pages, dashboards, and API-connected screens. Other libraries appear in project repositories; personal use of every one is not confirmed. Earlier MERN and Firebase work was training or a learning project.",
  ],
};

export const developmentPhilosophy = [
  {
    id: "philosophy-clarity",
    title: "Readable interfaces",
    description:
      "I prefer interface code that is straightforward to follow and consistent with the rest of the page.",
  },
  {
    id: "philosophy-scope",
    title: "Honest scope",
    description:
      "Project write-ups stay at product scope. Incomplete forms, mock data, and external APIs are described as they are.",
  },
  {
    id: "philosophy-stack",
    title: "A focused stack",
    description:
      "Next.js, React, JavaScript, and Tailwind CSS are the tools I use in my current role.",
  },
  {
    id: "philosophy-contribution",
    title: "Frontend contribution",
    description:
      "I contribute to user-facing pages and web dashboard interfaces. I do not claim sole ownership of these products.",
  },
];

export const languagesSpoken: {
  id: string;
  language: string;
  proficiency: string;
}[] = [
  {
    id: "lang-english",
    language: "English",
    proficiency: "",
  },
  {
    id: "lang-urdu",
    language: "Urdu",
    proficiency: "",
  },
];

export const funFacts: { id: string; label: string; detail: string }[] = [
  {
    id: "strength-communication",
    label: "Communication",
    detail: "Keeping conversations clear while interface work is in progress.",
  },
  {
    id: "strength-teamwork",
    label: "Teamwork",
    detail: "Working with teammates on shared pages and product interfaces.",
  },
  {
    id: "strength-problem-solving",
    label: "Problem-solving",
    detail: "Turning interface problems into practical frontend changes.",
  },
  {
    id: "strength-time",
    label: "Time management",
    detail: "Keeping frontend tasks moving alongside the rest of the work.",
  },
];
