import type { ExperienceEntry } from "./types";

/**
 * PLACEHOLDER experience entries.
 * The original template listed major tech companies with lorem copy.
 * Those claims are not treated as real. Replace each entry with verified roles.
 */

export const experienceEntries: ExperienceEntry[] = [
  {
    id: "experience-placeholder-senior",
    role: "[Role Title — replace]",
    company: "[Company Name — replace]",
    location: "Remote / [City — replace]",
    startDate: "2022",
    endDate: "Present",
    description:
      "Placeholder: describe your current responsibilities, ownership areas, and impact. Example themes — product features, architecture decisions, mentoring, reliability.",
    technologies: ["TypeScript", "React", "Next.js", "Node.js"],
    isPlaceholder: true,
  },
  {
    id: "experience-placeholder-mid",
    role: "[Role Title — replace]",
    company: "[Company Name — replace]",
    location: "[Location — replace]",
    startDate: "2020",
    endDate: "2022",
    description:
      "Placeholder: summarize shipped work across web or mobile, collaboration with design/product, and technical contributions.",
    technologies: ["React", "React Native", "MongoDB", "Node.js"],
    isPlaceholder: true,
  },
  {
    id: "experience-placeholder-early",
    role: "[Role Title — replace]",
    company: "[Company Name — replace]",
    location: "[Location — replace]",
    startDate: "2018",
    endDate: "2020",
    description:
      "Placeholder: early-career foundations — building features, learning delivery cadence, and strengthening fundamentals.",
    technologies: ["JavaScript", "React", "Node.js"],
    isPlaceholder: true,
  },
];
