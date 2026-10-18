import type { SkillGroup } from "./types";

/**
 * Skills from the Updated Full CV.
 * Java and Android are excluded. Repository libraries are labeled as unverified personal scope.
 */

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    description:
      "Current professional focus at Maze Digital, including responsive interfaces.",
    skills: [
      { id: "skill-next", name: "Next.js", iconKey: "next" },
      { id: "skill-react", name: "React", iconKey: "react" },
      { id: "skill-javascript", name: "JavaScript", iconKey: "javascript" },
      { id: "skill-tailwind", name: "Tailwind CSS", iconKey: "tailwind" },
      {
        id: "skill-responsive",
        name: "Responsive interfaces",
        iconKey: "uiux",
      },
    ],
  },
  {
    id: "other",
    title: "Dashboards and APIs",
    description:
      "Web dashboards and API-connected interfaces in the current frontend work. Personal use of every library inside a repository is not confirmed.",
    skills: [
      { id: "skill-dashboards", name: "Web dashboards", iconKey: "uiux" },
      { id: "skill-rest", name: "REST API integration", iconKey: "rest" },
    ],
  },
  {
    id: "tools",
    title: "Project repository libraries",
    description:
      "Present in the supplied case studies. Hands-on use is not verified for every item.",
    skills: [
      { id: "skill-typescript", name: "TypeScript", iconKey: "typescript" },
      { id: "skill-antd", name: "Ant Design", iconKey: "antd" },
      { id: "skill-radix", name: "shadcn/ui / Radix UI", iconKey: "radix" },
      { id: "skill-axios", name: "Axios", iconKey: "axios" },
      { id: "skill-rhf", name: "React Hook Form", iconKey: "reacthookform" },
      { id: "skill-yup", name: "Yup", iconKey: "tools" },
      { id: "skill-chartjs", name: "Chart.js", iconKey: "chartjs" },
      { id: "skill-recharts", name: "Recharts", iconKey: "recharts" },
      { id: "skill-gsap", name: "GSAP", iconKey: "gsap" },
      { id: "skill-motion", name: "Motion / Framer Motion", iconKey: "framer" },
      { id: "skill-swiper", name: "Swiper", iconKey: "swiper" },
      { id: "skill-redux", name: "Redux Toolkit", iconKey: "redux" },
      { id: "skill-router", name: "React Router", iconKey: "reactrouter" },
      { id: "skill-vite", name: "Vite", iconKey: "vite" },
      { id: "skill-wp", name: "WordPress REST API", iconKey: "wordpress" },
      { id: "skill-s3", name: "AWS S3 upload flows", iconKey: "aws" },
      { id: "skill-git", name: "Git / GitHub", iconKey: "git" },
    ],
  },
  {
    id: "backend",
    title: "Earlier training",
    description:
      "MERN coursework at SMIT and the OLX learning project. Not current professional specializations, and not employment.",
    skills: [
      { id: "skill-node", name: "Node.js", iconKey: "nodejs" },
      { id: "skill-express", name: "Express.js", iconKey: "express" },
      { id: "skill-mongo", name: "MongoDB", iconKey: "mongodb" },
      { id: "skill-firebase", name: "Firebase Auth", iconKey: "firebase" },
      { id: "skill-firestore", name: "Firestore", iconKey: "firebase" },
    ],
  },
  {
    id: "databases",
    title: "Earlier exposure",
    description:
      "Listed on historical CVs. Not claimed as current frontend specializations.",
    skills: [
      { id: "skill-aspnet", name: "ASP.NET", iconKey: "dotnet" },
      { id: "skill-sql", name: "SQL / MySQL", iconKey: "mysql" },
      {
        id: "skill-oop",
        name: "Object-oriented design",
        iconKey: "tools",
      },
      { id: "skill-db-design", name: "Database design", iconKey: "tools" },
    ],
  },
];
