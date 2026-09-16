/* eslint-disable react/jsx-props-no-spreading */
import "../styles/globals.css";
import "animate.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "../styles/timeline.css";
import type { AppProps } from "next/app";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import NavMenu from "../components/nav";
import Footer from "../components/footer";
import { footerSection } from "../config";

// Next.js owns CSS injection; prevent FA from injecting a second copy
config.autoAddCss = false;

/**
 * App-wide chrome: sticky navigation and footer wrap every page,
 * including the custom 404 route.
 */
const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <NavMenu />
    <Component {...pageProps} />
    {footerSection.display && <Footer />}
  </>
);

export default MyApp;
