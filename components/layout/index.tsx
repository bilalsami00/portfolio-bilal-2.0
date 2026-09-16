import Head from "next/head";
import { ReactNode } from "react";
import { siteIdentity, siteSeo } from "../../data/site";
import { routePaths } from "../../data/navigation";

type PageShellProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
};

/**
 * Shared document metadata + main landmark for public pages.
 */
const PageShell = ({
  children,
  title,
  description,
  path = routePaths.home,
  ogImage,
  noIndex = false,
}: PageShellProps) => {
  const documentTitle = title
    ? siteSeo.titleTemplate.replace("%s", title)
    : siteSeo.defaultTitle;
  const metaDescription = description || siteSeo.defaultDescription;
  const canonicalUrl = `${siteIdentity.siteUrl}${path === "/" ? "" : path}`;
  const shareImage = `${siteIdentity.siteUrl}${ogImage || siteSeo.ogImage}`;

  return (
    <>
      <Head>
        <title>{documentTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={siteSeo.keywords.join(", ")} />
        <meta name="author" content={siteIdentity.fullName} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href={siteIdentity.logoImage} type="image/png" />

        {noIndex ? (
          <meta name="robots" content="noindex, follow" />
        ) : (
          <meta name="robots" content="index, follow" />
        )}

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteIdentity.siteName} />
        <meta property="og:title" content={documentTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={shareImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={documentTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={shareImage} />
      </Head>

      <main id="main-content">{children}</main>
    </>
  );
};

export default PageShell;
