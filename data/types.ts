/**
 * Shared TypeScript contracts for portfolio content.
 * Pages and components should consume these shapes from data modules.
 */

export type SocialPlatform =
  | "linkedin"
  | "github"
  | "facebook"
  | "youtube"
  | "twitter"
  | "stackoverflow"
  | "email"
  | "other";

export type SocialLink = {
  id: string;
  label: string;
  platform: SocialPlatform;
  href: string;
  /** Accessible title for icon buttons */
  title: string;
  /** When true, link is a stub and should not be treated as active */
  isPlaceholder?: boolean;
};

export type NavigationItem = {
  id: string;
  label: string;
  href: string;
};

export type SiteAvailability = {
  statusLabel: string;
  statusDetail: string;
  isAvailableForWork: boolean;
};

export type SiteIdentity = {
  fullName: string;
  shortName: string;
  professionalTitle: string;
  tagline: string;
  introduction: string;
  location: string;
  email: string;
  phone: string;
  profileImage: string;
  logoImage: string;
  resumeUrl: string;
  siteUrl: string;
  siteName: string;
};

export type SiteSeo = {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  keywords: string[];
  ogImage: string;
};

export type CurrentFocusItem = {
  id: string;
  label: string;
  description: string;
};

export type ServiceCategory = {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  /** Resolves through `skillIconRegistry` (Skill Icons → Simple Icons). */
  iconKey: string;
};

export type ProjectCategory =
  | "Web Application"
  | "Mobile Application"
  | "Desktop Application"
  | "UI/UX"
  | "Open Source"
  | "Full Stack";

export type ProjectImage = {
  src: string;
  alt: string;
};

/**
 * Case study sections, in presentation order.
 * Text comes from the project .txt file; optional metadata stays off this object.
 */
export type ProjectCaseStudy = {
  overview: string[];
  problem: string;
  solution: string;
  features: string[];
  challenges: string[];
  lessons: string[];
};

export type PortfolioProject = {
  id: string;
  slug: string;
  title: string;
  /** Card summary derived from the case study overview. */
  shortDescription: string;
  /** Card preview. Also the first gallery image. */
  image: string;
  imageAlt: string;
  gallery: ProjectImage[];
  technologies: string[];
  category: ProjectCategory;
  /** Omitted when the case study does not document a URL. */
  liveUrl?: string;
  /** Omitted when the case study does not document a URL. */
  repositoryUrl?: string;
  /** Site presentation flag. Case studies do not mark featured work. */
  featured: boolean;
  year: string;
  caseStudy: ProjectCaseStudy;
};

export type SkillGroupId =
  | "frontend"
  | "backend"
  | "databases"
  | "tools"
  | "cms"
  | "cloud"
  | "other";

export type SkillItem = {
  id: string;
  name: string;
  iconKey?: string;
};

export type SkillGroup = {
  id: SkillGroupId;
  title: string;
  description: string;
  skills: SkillItem[];
};

export type ExperienceEntry = {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
  /** True when this entry must be replaced with real employment data */
  isPlaceholder: boolean;
};

export type EducationEntry = {
  id: string;
  degree: string;
  institution: string;
  institutionUrl?: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  isPlaceholder: boolean;
};

export type CertificationEntry = {
  id: string;
  name: string;
  issuer: string;
  year: string;
  credentialUrl?: string;
  isPlaceholder: boolean;
};

export type InterestItem = {
  id: string;
  title: string;
  description: string;
};

export type TestimonialEntry = {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  isPlaceholder: boolean;
};

export type LanguageEntry = {
  id: string;
  language: string;
  proficiency: string;
};

export type FunFact = {
  id: string;
  label: string;
  detail: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type PhilosophyPrinciple = {
  id: string;
  title: string;
  description: string;
};
