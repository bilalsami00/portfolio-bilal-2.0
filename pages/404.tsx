import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import Button from "../components/buttons/button";
import Container from "../components/container";
import { generalInfo } from "../config";
import { homePath } from "../utilities/paths";

/**
 * Custom Not Found page.
 * Next.js Pages Router serves this for unknown routes via `pages/404.tsx`.
 */
const NotFoundPage: NextPage = () => (
  <>
    <Head>
      <title>{`Page Not Found | ${generalInfo.projectName}`}</title>
      <meta
        name="description"
        content="The page you requested could not be found."
      />
      <link rel="icon" href="/assets/avatar.png" type="image/png" />
    </Head>

    <main>
      <Container className="min-h-[60vh] flex flex-col items-center justify-center py-24 text-center">
        <p className="text-primary-700 font-bold text-xl uppercase tracking-wide">
          404
        </p>
        <h1 className="mt-4 text-5xl font-extrabold josefinSans">
          Page Not Found
        </h1>
        <p className="mt-6 text-slate-500 max-w-[480px]">
          The page you are looking for does not exist or may have been moved.
          Check the URL, or return to the homepage to continue browsing.
        </p>
        <Link href={homePath} className="mt-10 inline-block">
          <Button className="uppercase">Back to Home</Button>
        </Link>
      </Container>
    </main>
  </>
);

export default NotFoundPage;
