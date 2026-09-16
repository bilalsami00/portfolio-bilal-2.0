/* eslint-disable react/jsx-props-no-spreading */
import "../styles/globals.css";
import "animate.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import type { AppProps } from "next/app";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import SiteNavigation from "../components/nav";
import SiteFooter from "../components/footer";
import { ThemeProvider } from "../components/shared/ThemeProvider";

config.autoAddCss = false;

/**
 * Global chrome: theme, atmosphere, navigation, and footer wrap every route.
 */
const PortfolioApp = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider>
    <div className="site-atmosphere min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] btn-primary"
      >
        Skip to content
      </a>
      <SiteNavigation />
      <div className="flex-1">
        <Component {...pageProps} />
      </div>
      <SiteFooter />
    </div>
  </ThemeProvider>
);

export default PortfolioApp;
