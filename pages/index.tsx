import type { NextPage } from "next";
import Introduction from "../components/introduction";
import PageLayout from "../components/layout";
import { introSection } from "../config";

const HomePage: NextPage = () => (
  <PageLayout>{introSection.display && <Introduction />}</PageLayout>
);

export default HomePage;
