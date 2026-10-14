import type { NextPage } from "next";
import PageShell from "../components/layout";
import NotFoundContent from "../components/notFound";
import { siteIdentity } from "../data/site";

/**
 * Native Pages Router 404 — served with HTTP 404 for unknown URLs.
 */
const NotFoundPage: NextPage = () => (
  <PageShell
    title="Page Not Found"
    description={`The requested page could not be found on ${siteIdentity.siteName}.`}
    path="/404"
    noIndex
  >
    <NotFoundContent />
  </PageShell>
);

export default NotFoundPage;
