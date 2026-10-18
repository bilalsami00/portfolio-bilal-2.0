import type { CertificationEntry, EducationEntry } from "./types";

/**
 * Education from the Updated Full CV.
 * No named professional certifications are documented.
 */

export const educationEntries: EducationEntry[] = [
  {
    id: "education-uok-bscs",
    degree: "BS Computer Science",
    institution: "University of Karachi",
    location: "Karachi, Pakistan",
    startDate: "2019",
    endDate: "2023",
    description:
      "Bachelor of Science in Computer Science, graduated in 2023. CGPA 2.52.",
    isPlaceholder: false,
  },
  {
    id: "education-smit-mern",
    degree: "MERN Stack Development (course)",
    institution: "Saylani Mass IT Training (SMIT)",
    location: "Karachi, Pakistan",
    startDate: "2022",
    endDate: "2023",
    description: "Course covering MongoDB, Express.js, React, and Node.js.",
    isPlaceholder: false,
  },
  {
    id: "education-intermediate",
    degree: "Intermediate",
    institution: "Delhi Govt. College",
    location: "Karachi, Pakistan",
    startDate: "2016",
    endDate: "2018",
    description: "Intermediate, 74%.",
    isPlaceholder: false,
  },
  {
    id: "education-matric",
    degree: "Matriculation",
    institution: "St. Patrick's High School",
    location: "Karachi, Pakistan",
    startDate: "2005",
    endDate: "2015",
    description: "Matriculation, 84%.",
    isPlaceholder: false,
  },
];

export const certificationEntries: CertificationEntry[] = [];
