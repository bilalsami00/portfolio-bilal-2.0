import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { primaryNavigation, routePaths } from "../../data/navigation";
import { siteIdentity } from "../../data/site";
import useScrollPosition from "../../hooks/useScrollPosition";
import Container from "../shared/Container";
import ThemeToggle from "../shared/ThemeToggle";
import MenuIcon from "../svgs/menuIcon";
import XIcon from "../svgs/xIcon";

/**
 * Site-wide sticky navigation with theme toggle.
 */
const SiteNavigation = () => {
  const router = useRouter();
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 24;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnRoute = () => setMenuOpen(false);
    router.events.on("routeChangeComplete", closeOnRoute);
    return () => {
      router.events.off("routeChangeComplete", closeOnRoute);
    };
  }, [router.events]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const { documentElement } = document;
    const previousHtmlOverflow = documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  let headerSurface = "bg-transparent border-b border-transparent";
  if (menuOpen) {
    headerSurface = "bg-ink-900 border-b border-steel-700/40";
  } else if (isScrolled) {
    headerSurface =
      "bg-ink-900/90 border-b border-steel-700/40 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.35)]";
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${headerSurface}`}
    >
      <Container className="flex items-center justify-between py-3 md:py-3.5">
        <Link
          href={routePaths.home}
          className="flex items-center gap-3 group min-h-[2.75rem]"
        >
          <img
            src={siteIdentity.logoImage}
            alt={`${siteIdentity.fullName} logo`}
            width={40}
            height={44}
            className="h-9 sm:h-10 w-auto object-contain"
          />
          <span className="font-display text-lg sm:text-xl md:text-2xl font-bold text-parchment-100 group-hover:text-crimson-300 transition-colors leading-none">
            {siteIdentity.shortName}
          </span>
        </Link>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="
              inline-flex h-11 w-11 items-center justify-center
              border border-steel-700 text-parchment-200
              transition-colors duration-300
              hover:border-crimson-500/60 hover:text-parchment-100
              focus-visible:border-crimson-500/60
            "
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <XIcon color="currentColor" />
            ) : (
              <MenuIcon color="currentColor" />
            )}
          </button>
        </div>

        <nav
          id="primary-navigation"
          className={`
            ${menuOpen ? "flex" : "hidden"}
            md:flex absolute md:static inset-x-0 top-full
            flex-col md:flex-row md:items-center gap-1 md:gap-1
            min-h-[calc(100dvh-4.5rem)] md:min-h-0
            max-h-[calc(100dvh-4.5rem)] md:max-h-none overflow-y-auto md:overflow-visible
            bg-ink-900 md:bg-transparent border-b md:border-0 border-steel-700/50
            px-4 py-5 md:p-0 shadow-[0_18px_36px_rgba(0,0,0,0.35)] md:shadow-none
          `}
        >
          <ul className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0.5">
            {primaryNavigation.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`
                      nav-link
                      ${
                        isActive
                          ? "nav-link-active"
                          : "text-parchment-300 hover:text-parchment-100"
                      }
                    `}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 pt-4 md:mt-0 md:pt-0 md:ml-3 border-t md:border-0 border-steel-700/40 flex items-center gap-2">
            <span className="hidden md:inline-flex">
              <ThemeToggle />
            </span>
            {siteIdentity.resumeUrl &&
              siteIdentity.resumeUrl !== "#" &&
              !siteIdentity.resumeUrl.includes("replace") && (
                <a
                  href={siteIdentity.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary !px-4 !py-2 !min-h-[2.5rem] text-xs"
                >
                  Resume
                </a>
              )}
          </div>
        </nav>
      </Container>
    </header>
  );
};

export default SiteNavigation;
