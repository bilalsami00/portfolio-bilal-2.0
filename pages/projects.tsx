import type { NextPage } from "next";
import PageLayout from "../components/layout";
import Portfolio from "../components/portfolio";
import { portfolioSection } from "../config";

const ProjectsPage: NextPage = () => (
  <PageLayout
    title="Projects"
    description={
      portfolioSection.heading ||
      portfolioSection.title ||
      "Featured projects and portfolio work."
    }
  >
    {portfolioSection.display && <Portfolio />}
  </PageLayout>
);

export default ProjectsPage;
