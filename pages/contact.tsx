import type { NextPage } from "next";
import PageShell from "../components/layout";
import ContactPageContent from "../components/contact/ContactPageContent";
import { routePaths } from "../data/navigation";
import { siteIdentity } from "../data/site";

const ContactPage: NextPage = () => (
  <PageShell
    title="Contact"
    description={`Contact ${siteIdentity.fullName}, Frontend Developer at Maze Digital in Karachi.`}
    path={routePaths.contact}
  >
    <ContactPageContent />
  </PageShell>
);

export default ContactPage;
