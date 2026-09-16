import type { NextPage } from "next";
import Contact from "../components/contact";
import PageLayout from "../components/layout";
import { contactSection } from "../config";

const ContactPage: NextPage = () => (
  <PageLayout
    title="Contact"
    description={
      contactSection.description || contactSection.heading || "Get in touch."
    }
  >
    <div className="mt-20">{contactSection.display && <Contact />}</div>
  </PageLayout>
);

export default ContactPage;
