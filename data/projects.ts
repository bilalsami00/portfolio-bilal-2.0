import type { PortfolioProject, ProjectCategory } from "./types";

/**
 * Projects use existing repository images.
 * Narratives are professional placeholders — replace with real case studies.
 */

export const projectCategories: Array<ProjectCategory | "All"> = [
  "All",
  "Web Application",
  "Mobile Application",
  "Desktop Application",
  "Full Stack",
  "UI/UX",
  "Open Source",
];

export const projects: PortfolioProject[] = [
  {
    id: "project-nexus-dashboard",
    slug: "nexus-operations-dashboard",
    title: "Nexus Operations Dashboard",
    shortDescription:
      "A full-stack operations console for monitoring workflows, alerts, and team activity in one dark, focused interface.",
    fullDescription:
      "Placeholder case study: a React and Node.js dashboard for operational visibility. Built to demonstrate modular UI composition, authenticated views, and API-driven status panels.",
    problemSolved:
      "Teams needed a single place to inspect live operational state instead of jumping across scattered tools.",
    outcomes: [
      "Placeholder: unified status overview for multiple service streams",
      "Placeholder: faster triage through prioritized alert surfaces",
      "Placeholder: reusable chart and table primitives for future modules",
    ],
    outcomesArePlaceholder: true,
    image: "/assets/images/portfolio/portfolio-1.jpg",
    gallery: [
      "/assets/images/portfolio/portfolio-1.jpg",
      "/assets/images/portfolio/portfolio-2.jpg",
    ],
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "MongoDB"],
    category: "Full Stack",
    liveUrl: "https://example.com/project1",
    repositoryUrl: "https://github.com/smkh-pro",
    featured: true,
    year: "2024",
    isPlaceholderContent: true,
  },
  {
    id: "project-signal-mobile",
    slug: "signal-field-companion",
    title: "Signal Field Companion",
    shortDescription:
      "Cross-platform React Native companion app for field notes, sync status, and lightweight task capture.",
    fullDescription:
      "Placeholder case study: a React Native mobile product focused on offline-friendly capture and clean information hierarchy for people working away from a desk.",
    problemSolved:
      "Field users needed a fast mobile surface for logging updates without fighting a desktop-first workflow.",
    outcomes: [
      "Placeholder: shared component patterns between web and mobile thinking",
      "Placeholder: clearer task intake on smaller screens",
    ],
    outcomesArePlaceholder: true,
    image: "/assets/images/portfolio/portfolio-2.jpg",
    gallery: ["/assets/images/portfolio/portfolio-2.jpg"],
    technologies: ["React Native", "TypeScript", "Node.js"],
    category: "Mobile Application",
    liveUrl: "https://example.com/project2",
    featured: true,
    year: "2023",
    isPlaceholderContent: true,
  },
  {
    id: "project-forge-desktop",
    slug: "forge-desktop-toolkit",
    title: "Forge Desktop Toolkit",
    shortDescription:
      "An Electron desktop utility for local productivity workflows with a restrained, high-contrast interface.",
    fullDescription:
      "Placeholder case study: Electron + web technologies packaged as a desktop toolkit. Emphasizes native-feeling navigation and reliable local state.",
    problemSolved:
      "Some workflows are faster as dedicated desktop tools than as browser tabs.",
    outcomes: [
      "Placeholder: packaged desktop runtime with shared web UI skills",
      "Placeholder: reduced context-switching for repetitive local tasks",
    ],
    outcomesArePlaceholder: true,
    image: "/assets/images/portfolio/portfolio-3.jpg",
    gallery: ["/assets/images/portfolio/portfolio-3.jpg"],
    technologies: ["Electron", "React", "TypeScript", "Node.js"],
    category: "Desktop Application",
    liveUrl: "https://example.com/project3",
    featured: false,
    year: "2023",
    isPlaceholderContent: true,
  },
  {
    id: "project-veil-marketing",
    slug: "veil-product-site",
    title: "Veil Product Site",
    shortDescription:
      "A cinematic marketing site with performance-aware sections, SEO foundations, and strong visual rhythm.",
    fullDescription:
      "Placeholder case study: a Next.js marketing experience demonstrating layout craft, content hierarchy, and technical SEO basics for a product launch narrative.",
    problemSolved:
      "Product storytelling needed a page structure that felt intentional without sacrificing load performance.",
    outcomes: [
      "Placeholder: clearer conversion path from hero to contact",
      "Placeholder: semantic structure prepared for search visibility",
    ],
    outcomesArePlaceholder: true,
    image: "/assets/images/portfolio/portfolio-4.jpg",
    gallery: ["/assets/images/portfolio/portfolio-4.jpg"],
    technologies: ["Next.js", "React", "TypeScript"],
    category: "Web Application",
    liveUrl: "https://example.com/project4",
    featured: true,
    year: "2024",
    isPlaceholderContent: true,
  },
  {
    id: "project-atlas-admin",
    slug: "atlas-content-console",
    title: "Atlas Content Console",
    shortDescription:
      "Admin-facing web console for content review, publishing states, and contributor coordination.",
    fullDescription:
      "Placeholder case study: a React admin experience for editorial workflows, built around predictable forms, status tags, and table-driven management.",
    problemSolved:
      "Editors needed a dependable console for reviewing and releasing content without developer intervention.",
    outcomes: [
      "Placeholder: role-aware content states",
      "Placeholder: faster publishing reviews",
    ],
    outcomesArePlaceholder: true,
    image: "/assets/images/portfolio/portfolio-5.jpg",
    gallery: ["/assets/images/portfolio/portfolio-5.jpg"],
    technologies: ["React", "Node.js", "MongoDB", "TypeScript"],
    category: "Full Stack",
    liveUrl: "https://example.com/project5",
    featured: false,
    year: "2022",
    isPlaceholderContent: true,
  },
  {
    id: "project-ink-ui-kit",
    slug: "ink-interface-system",
    title: "Ink Interface System",
    shortDescription:
      "UI exploration focused on dark surfaces, typographic hierarchy, and reusable interaction patterns.",
    fullDescription:
      "Placeholder case study: a design-to-code interface study emphasizing accessible contrast, component consistency, and atmospheric presentation without sacrificing usability.",
    problemSolved:
      "Teams needed a dark visual language that still read as professional product UI.",
    outcomes: [
      "Placeholder: reusable button, card, and form patterns",
      "Placeholder: documented spacing and type scale",
    ],
    outcomesArePlaceholder: true,
    image: "/assets/images/portfolio/portfolio-6.jpg",
    gallery: ["/assets/images/portfolio/portfolio-6.jpg"],
    technologies: ["React", "TypeScript", "UI/UX"],
    category: "UI/UX",
    liveUrl: "https://example.com/project6",
    featured: false,
    year: "2022",
    isPlaceholderContent: true,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return projects.find((project) => project.slug === slug);
}
