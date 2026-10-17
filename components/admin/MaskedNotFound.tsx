import PageShell from "../layout";
import NotFoundContent from "../notFound";
import { siteIdentity } from "../../data/site";

/** Same output as the public 404 so admin routes are not advertised. */
const MaskedNotFound = () => (
  <PageShell
    title="Page Not Found"
    description={`The requested page could not be found on ${siteIdentity.siteName}.`}
    path="/404"
    noIndex
  >
    <NotFoundContent />
  </PageShell>
);

export default MaskedNotFound;
