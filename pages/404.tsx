import type { NextPage } from "next";
import Head from "next/head";
import NotFoundContent from "../components/notFound";
import { generalInfo } from "../config";

/**
 * Custom 404 page for the Pages Router.
 * Next.js serves this automatically for unknown and invalid routes.
 */
const NotFoundPage: NextPage = () => (
  <>
    <Head>
      <title>{`Page Not Found | ${generalInfo.projectName}`}</title>
      <meta
        name="description"
        content="The page you requested could not be found. Return home or browse projects."
      />
      <meta name="robots" content="noindex, follow" />
      <link rel="icon" href="/assets/avatar.png" type="image/png" />
    </Head>

    <main>
      <NotFoundContent />
    </main>
  </>
);

export default NotFoundPage;
