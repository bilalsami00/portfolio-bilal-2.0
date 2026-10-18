import type { NextPage } from "next";
import PageShell from "../components/layout";
import ProjectsPageContent from "../components/projects/ProjectsPageContent";
import { routePaths } from "../data/navigation";

const ProjectsPage: NextPage = () => (
  <PageShell
    title="Projects"
    description="Frontend case studies from Maze Digital work by Bilal Sami. Each write-up describes the product, not personal ownership of every feature."
    path={routePaths.projects}
  >
    <ProjectsPageContent />
  </PageShell>
);

export default ProjectsPage;
