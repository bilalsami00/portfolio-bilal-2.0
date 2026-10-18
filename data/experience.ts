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
      "Full-time. Develop and maintain web frontend interfaces using Next.js, React, JavaScript, and Tailwind CSS. Contribute to responsive agency websites, landing pages, and web dashboards. Work in frontend codebases with reusable UI and externally connected application workflows. Exact personal feature ownership is not fully documented.",
    technologies: ["Next.js", "React", "JavaScript", "Tailwind CSS"],
    isPlaceholder: false,
  },
  {
    id: "experience-ecommerce-intern",
    role: "E-commerce Marketing Intern",
    company: "Company not documented",
    location: "Location not documented",
    startDate: "2023",
    endDate: "3 months",
    description:
      "Supported search engine optimization, content optimization, and marketing activities, according to the 2024 CV. The company name and the specific months are not documented.",
    technologies: ["SEO", "Content optimization"],
    isPlaceholder: false,
  },
  {
    id: "experience-spectrum",
    role: "Call Center Agent",
    company: "Spectrum",
    location: "Location not documented",
    startDate: "3 months",
    endDate: "Dates not documented",
    description:
      "Provided customer service for internet, telephone, and television services, including billing and general queries. An older CV also describes marketing and service sales. Exact employment dates are not documented.",
    technologies: [],
    isPlaceholder: false,
  },
  {
    id: "experience-contractor",
    role: "Junior Data Analyst & Data Entry",
    company: "Private Contractor",
    location: "Location not documented",
    startDate: "Dates not documented",
    endDate: "Duration not documented",
    description:
      "Data entry, data accuracy, processing, and general analytical support, as described in earlier CVs. Tools, employer, and timeline were not supplied.",
    technologies: [],
    isPlaceholder: false,
  },
];
