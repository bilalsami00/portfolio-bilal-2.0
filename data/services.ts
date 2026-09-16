import type { ServiceCategory } from "./types";

/**
 * Capability categories supported by the owner's demonstrated stack
 * (web, frontend, backend, mobile, UI, performance, SEO).
 */

export const serviceCategories: ServiceCategory[] = [
  {
    id: "service-web",
    title: "Web Development",
    description:
      "End-to-end web products with thoughtful information architecture and maintainable codebases.",
    highlights: [
      "Multi-page application structure",
      "Content-driven sections",
      "Production-ready Next.js foundations",
    ],
    iconKey: "web",
  },
  {
    id: "service-frontend",
    title: "Frontend Development",
    description:
      "React interfaces with clear hierarchy, responsive layouts, and purposeful interaction design.",
    highlights: [
      "Component-driven UI",
      "TypeScript-first development",
      "Accessible interaction patterns",
    ],
    iconKey: "frontend",
  },
  {
    id: "service-backend",
    title: "Backend Development",
    description:
      "Node.js services and API layers that support real product workflows.",
    highlights: [
      "REST-oriented services",
      "Data modeling with MongoDB",
      "Auth-ready structures",
    ],
    iconKey: "backend",
  },
  {
    id: "service-mobile",
    title: "Mobile Development",
    description:
      "React Native applications that extend product capabilities beyond the browser.",
    highlights: [
      "Cross-platform delivery",
      "Shared mental models with web React",
      "Mobile-first interaction flows",
    ],
    iconKey: "mobile",
  },
  {
    id: "service-uiux",
    title: "UI / UX",
    description:
      "Visual systems and user flows that balance atmosphere with professional clarity.",
    highlights: [
      "Dark, high-contrast presentation",
      "Consistent spacing and type scales",
      "Conversion-minded section design",
    ],
    iconKey: "uiux",
  },
  {
    id: "service-performance",
    title: "Performance Optimization",
    description:
      "Practical performance work across assets, rendering paths, and interaction cost.",
    highlights: [
      "Image and asset discipline",
      "Lean animation choices",
      "Responsive performance awareness",
    ],
    iconKey: "performance",
  },
  {
    id: "service-seo",
    title: "SEO",
    description:
      "Technical SEO foundations: metadata, semantic structure, and shareable page previews.",
    highlights: [
      "Per-page titles and descriptions",
      "Open Graph metadata",
      "Canonical-friendly route structure",
    ],
    iconKey: "seo",
  },
];
