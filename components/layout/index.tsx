import Head from "next/head";
import { ReactNode } from "react";
import { generalInfo } from "../../config";

type PageLayoutProps = {
  children: ReactNode;
  /** Page-specific document title segment (appended to the site name). */
  title?: string;
  description?: string;
};

/**
 * Shared page shell for document metadata and main content.
 * Site-wide navigation and footer are mounted in `_app`.
 */
const PageLayout = ({ children, title, description }: PageLayoutProps) => {
  const documentTitle = title
    ? `${title} | ${generalInfo.projectName}`
    : generalInfo.seoTitle;

  return (
    <>
      <Head>
        <title>{documentTitle}</title>
        <meta
          name="description"
          content={description || generalInfo.seoDescription}
        />
        <meta name="keywords" content={generalInfo.seoKeywords} />
        <link rel="icon" href="/assets/avatar.png" type="image/png" />
      </Head>

      <main>{children}</main>
    </>
  );
};

export default PageLayout;
