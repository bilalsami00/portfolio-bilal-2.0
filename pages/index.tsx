import type { NextPage } from "next";
import PageShell from "../components/layout";
import HomeHeroSection from "../components/home/HomeHeroSection";
import HomeCurrentFocusSection from "../components/home/HomeCurrentFocusSection";
import HomeAboutPreviewSection from "../components/home/HomeAboutPreviewSection";
import HomeCapabilitiesSection from "../components/home/HomeCapabilitiesSection";
import HomeFeaturedProjectsSection from "../components/home/HomeFeaturedProjectsSection";
import HomeSkillsSection from "../components/home/HomeSkillsSection";
import HomeJourneySection from "../components/home/HomeJourneySection";
import HomeEducationPreviewSection from "../components/home/HomeEducationPreviewSection";
import HomeInterestsSection from "../components/home/HomeInterestsSection";
import HomeTestimonialsSection from "../components/home/HomeTestimonialsSection";
import ContactCtaBanner from "../components/shared/ContactCtaBanner";
import { siteSeo } from "../data/site";
import { routePaths } from "../data/navigation";

const HomePage: NextPage = () => (
  <PageShell description={siteSeo.defaultDescription} path={routePaths.home}>
    <HomeHeroSection />
    <div className="steel-rule mx-auto max-w-[72rem]" />
    <HomeCurrentFocusSection />
    <HomeAboutPreviewSection />
    <HomeCapabilitiesSection />
    <HomeFeaturedProjectsSection />
    <HomeSkillsSection />
    <HomeJourneySection />
    <HomeEducationPreviewSection />
    <HomeInterestsSection />
    <HomeTestimonialsSection />
    <ContactCtaBanner />
  </PageShell>
);

export default HomePage;
