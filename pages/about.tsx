import type { NextPage } from "next";
import PageShell from "../components/layout";
import AboutPageContent from "../components/about/AboutPageContent";
import { routePaths } from "../data/navigation";
import { siteIdentity } from "../data/site";

const AboutPage: NextPage = () => (
  <PageShell
    title="About"
    description={`Professional profile of ${siteIdentity.fullName} — engineering identity, experience, education, skills, and philosophy.`}
    path={routePaths.about}
  >
    <AboutPageContent />
  </PageShell>
);

export default AboutPage;
