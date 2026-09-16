import type { NextPage } from "next";
import About from "../components/about";
import Experience from "../components/experience";
import PageLayout from "../components/layout";
import { aboutSection, experienceSection } from "../config";

/**
 * About page: biography/skills plus professional experience timeline.
 * Experience has no dedicated route, so it lives here with related content.
 */
const AboutPage: NextPage = () => (
  <PageLayout
    title="About"
    description={aboutSection.description || "About me and my experience."}
  >
    {aboutSection.display && <About />}
    {experienceSection.display && (
      <>
        <Experience />
        <div className="w-full border-t border-primary-100 my-20" />
      </>
    )}
  </PageLayout>
);

export default AboutPage;
