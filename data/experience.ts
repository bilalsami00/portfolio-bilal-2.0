import type { ExperienceEntry } from "./types";

/**
 * Employment from the Updated Full CV.
 * Missing company names and dates stay undocumented. Android work is not listed.
 */

export const experienceEntries: ExperienceEntry[] = [
  {
    id: "experience-maze-digital",
    role: "Frontend Developer",
    company: "Maze Digital",
    companyUrl: "https://www.mazedigital.co",
    location: "Karachi, Pakistan",
    startDate: "January 2025",
    endDate: "Present",
    description:
      "Develop and maintain web frontend interfaces using Next.js, React, JavaScript, and Tailwind CSS. Contribute to responsive agency websites, landing pages, and web dashboards, including reusable UI and API-connected screens. Project write-ups describe the product, not every feature I personally built.",
    technologies: ["Next.js", "React", "JavaScript", "Tailwind CSS"],
    isPlaceholder: false,
  },
  {
    id: "experience-ecommerce-intern",
    role: "E-commerce Marketing Intern",
    company: "",
    location: "",
    startDate: "2023",
    endDate: "3 months",
    description:
      "Supported search engine optimization, content optimization, and marketing activities during a three-month internship.",
    technologies: ["SEO", "Content optimization"],
    isPlaceholder: false,
  },
  {
    id: "experience-spectrum",
    role: "Call Center Agent",
    company: "Spectrum",
    location: "",
    startDate: "3 months",
    endDate: "",
    description:
      "Customer service for internet, telephone, and television, including billing, general queries, and service sales.",
    technologies: [],
    isPlaceholder: false,
  },
  {
    id: "experience-contractor",
    role: "Junior Data Analyst & Data Entry",
    company: "Private Contractor",
    location: "",
    startDate: "",
    endDate: "",
    description:
      "Data entry, data accuracy, processing, and general analytical support.",
    technologies: [],
    isPlaceholder: false,
  },
];
