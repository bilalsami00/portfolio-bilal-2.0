import type {
  CurrentFocusItem,
  SiteIdentity,
  SiteSeo,
  SiteAvailability,
} from "./types";

/**
 * Core site identity derived from existing OpenFolio config / social profiles.
 * Do not invent personal claims beyond what the repository already contains.
 */

export const siteIdentity: SiteIdentity = {
  fullName: "Kashan Haider",
  shortName: "Kashan",
  professionalTitle: "Software Engineer",
  tagline: "Building resilient web and mobile products with disciplined craft.",
  introduction:
    "I design and develop scalable web and mobile applications with a focus on clean architecture, thoughtful interfaces, and solutions that hold up under real-world pressure.",
  location: "Available globally (remote-friendly)",
  email: "contact@KashanHaider.com",
  phone: "+1 (567)-257-8716",
  profileImage: "/assets/images/hacker.jpg",
  logoImage: "/assets/images/avatar.png",
  resumeUrl: "https://mutualfilesharing.com/UploadedFiles/exampleResume.pdf",
  siteUrl: "https://openfolio.vercel.app",
  siteName: "Kashan Haider",
};

export const siteAvailability: SiteAvailability = {
  statusLabel: "Open to opportunities",
  statusDetail:
    "Available for full-time roles, contract engagements, and selective freelance collaborations.",
  isAvailableForWork: true,
};

export const siteSeo: SiteSeo = {
  defaultTitle: "Kashan Haider | Software Engineer Portfolio",
  titleTemplate: "%s | Kashan Haider",
  defaultDescription:
    "Portfolio of Kashan Haider — software engineer specializing in web, mobile, and full-stack product development.",
  keywords: [
    "Kashan Haider",
    "Software Engineer",
    "React",
    "Next.js",
    "React Native",
    "Node.js",
    "TypeScript",
    "Portfolio",
  ],
  ogImage: "/assets/images/programmer.png",
};

export const currentFocusItems: CurrentFocusItem[] = [
  {
    id: "focus-typescript",
    label: "TypeScript systems",
    description:
      "Strongly typed application layers across frontend and Node.js services.",
  },
  {
    id: "focus-react-ecosystem",
    label: "React & Next.js",
    description:
      "Component architecture, routing strategy, and performance-conscious UI delivery.",
  },
  {
    id: "focus-mobile",
    label: "React Native",
    description:
      "Cross-platform mobile experiences sharing patterns with the web stack.",
  },
  {
    id: "focus-quality",
    label: "Testing discipline",
    description:
      "Jest and Cypress-driven confidence for features that must ship reliably.",
  },
];

export const aboutPreview = {
  heading: "Engineer by trade. Craftsman by temperament.",
  summary:
    "I care about systems that are readable, interfaces that feel intentional, and delivery that respects both users and the teams who maintain the code afterward.",
  ctaLabel: "Read the full profile",
  ctaHref: "/about",
};

export const engineeringIdentity = {
  heading: "Engineering identity",
  paragraphs: [
    "I approach software as long-form craft: understand the constraint, design the structure, then refine until the solution is both usable and maintainable.",
    "Curiosity drives the stack choices. Discipline drives the implementation. Detail decides whether the product feels finished.",
  ],
};

export const developmentPhilosophy = [
  {
    id: "philosophy-clarity",
    title: "Clarity over cleverness",
    description:
      "Code should explain itself. Clever shortcuts that hide intent usually cost more later.",
  },
  {
    id: "philosophy-systems",
    title: "Systems thinking",
    description:
      "Features live inside flows, data models, and failure modes. I design with those edges in mind.",
  },
  {
    id: "philosophy-iteration",
    title: "Deliberate iteration",
    description:
      "Ship thoughtfully, measure honestly, and improve without rewriting the foundation every sprint.",
  },
  {
    id: "philosophy-ownership",
    title: "End-to-end ownership",
    description:
      "From interface polish to API contracts and deploy readiness — I prefer owning outcomes, not just tickets.",
  },
];

export const languagesSpoken = [
  {
    id: "lang-english",
    language: "English",
    proficiency: "Professional working proficiency (placeholder — update)",
  },
  {
    id: "lang-urdu",
    language: "Urdu",
    proficiency: "Native / bilingual proficiency (placeholder — update)",
  },
];

export const funFacts = [
  {
    id: "fact-learning",
    label: "Always learning",
    detail:
      "New frameworks are interesting; durable engineering principles are essential.",
  },
  {
    id: "fact-visual",
    label: "Visual sensibility",
    detail:
      "Dark atmospheres, strong typography, and intentional negative space influence how I think about product UI.",
  },
  {
    id: "fact-media",
    label: "Narrative media",
    detail:
      "Anime, manga, and cinematic storytelling sharpen an eye for pacing, tension, and visual hierarchy.",
  },
  {
    id: "fact-tools",
    label: "Tooling curiosity",
    detail:
      "From Electron desktops to mobile runtimes — I enjoy understanding how software reaches the user.",
  },
];
