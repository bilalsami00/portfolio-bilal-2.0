/* eslint-disable react/jsx-props-no-spreading */
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import SiteNavigation from "../components/nav";
import SiteFooter from "../components/footer";
import KeyboardShortcuts from "../components/shared/KeyboardShortcuts";
import PathMemory from "../components/shared/PathMemory";
import SmoothScroll from "../components/shared/SmoothScroll";
import { ThemeProvider } from "../components/shared/ThemeProvider";
import VisitorTracker from "../components/shared/VisitorTracker";
import { isMissionControlPath } from "../data/navigation";
import type { NextPageWithLayout } from "../utilities/pageLayout";

config.autoAddCss = false;

type PortfolioAppProps = AppProps & {
  Component: NextPageWithLayout;
};

/**
 * Global chrome: theme, atmosphere, navigation, and footer wrap every route.
 */
const PortfolioApp = ({ Component, pageProps }: PortfolioAppProps) => {
  const { pathname } = useRouter();
  const isMissionControl = isMissionControlPath(pathname);
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ThemeProvider>
      <div
        className="site-atmosphere min-h-screen flex flex-col"
        data-surface={isMissionControl ? "mission-control" : undefined}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] btn-primary"
        >
          Skip to content
        </a>
        <SiteNavigation />
        <div className="flex-1">{getLayout(<Component {...pageProps} />)}</div>
        <SiteFooter />
        <KeyboardShortcuts />
        <SmoothScroll />
        <PathMemory />
        <VisitorTracker />
      </div>
    </ThemeProvider>
  );
};

export default PortfolioApp;
