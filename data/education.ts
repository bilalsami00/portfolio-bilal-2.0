import type { CertificationEntry, EducationEntry } from "./types";

/**
 * Education and certifications.
 * Original config referenced University of London with lorem text — treated as placeholder.
 */

export const educationEntries: EducationEntry[] = [
  {
    id: "education-placeholder-primary",
    degree: "[Degree / Program — replace]",
    institution: "[Institution — replace]",
    institutionUrl: undefined,
    location: "[Location — replace]",
    startDate: "20XX",
    endDate: "20XX",
    description:
      "Placeholder: add field of study, notable coursework, thesis, or academic focus areas relevant to software engineering.",
    isPlaceholder: true,
  },
];

export const certificationEntries: CertificationEntry[] = [
  {
    id: "cert-placeholder-1",
    name: "[Certification Name — replace]",
    issuer: "[Issuer — replace]",
    year: "20XX",
    isPlaceholder: true,
  },
  {
    id: "cert-placeholder-2",
    name: "[Certification Name — replace]",
    issuer: "[Issuer — replace]",
    year: "20XX",
    isPlaceholder: true,
  },
];
