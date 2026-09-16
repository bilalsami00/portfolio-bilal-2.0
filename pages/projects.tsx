import type { NextPage } from "next";
import PageShell from "../components/layout";
import ProjectsPageContent from "../components/projects/ProjectsPageContent";
import { routePaths } from "../data/navigation";

const ProjectsPage: NextPage = () => (
  <PageShell
    title="Projects"
    description="Explore web, mobile, desktop, and UI projects by Bilal Sami — filterable archive with case details."
    path={routePaths.projects}
  >
    <ProjectsPageContent />
  </PageShell>
);

export default ProjectsPage;
