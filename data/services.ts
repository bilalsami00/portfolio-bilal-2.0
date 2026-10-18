import type { ServiceCategory } from "./types";

/**
 * Frontend work actually reflected by the Maze Digital projects.
 * These are contribution areas, not offered freelance services.
 */

export const serviceCategories: ServiceCategory[] = [
  {
    id: "service-frontend",
    title: "Frontend development",
    description:
      "Interfaces built with Next.js, React, JavaScript, and Tailwind CSS.",
    highlights: [
      "Next.js, React, and JavaScript",
      "Tailwind CSS layout and styling",
      "Responsive page layouts",
    ],
    iconKey: "frontend",
  },
  {
    id: "service-web",
    title: "Marketing websites",
    description:
      "Public, user-facing sites such as the Maze Digital website and other campaign or product pages.",
    highlights: [
      "Service and landing pages",
      "Shared page sections",
      "Lead and content layouts",
    ],
    iconKey: "web",
  },
  {
    id: "service-dashboards",
    title: "Web dashboards",
    description:
      "Admin and operations interfaces that sit on external APIs. Some screens in the case studies still use demo data.",
    highlights: [
      "Admin and portal layouts",
      "Forms and data tables",
      "API-backed views where the case study documents them",
    ],
    iconKey: "uiux",
  },
  {
    id: "service-api",
    title: "API-connected interfaces",
    description:
      "Frontend screens that call external APIs. Some case-study modules still use demo data or unfinished flows.",
    highlights: [
      "REST-backed admin views",
      "Forms that post to external services",
      "Product limits called out in each case study",
    ],
    iconKey: "rest",
  },
];
