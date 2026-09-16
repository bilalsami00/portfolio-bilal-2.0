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
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`
        sticky top-0 z-50 transition-all duration-500
        ${
          isScrolled
            ? "bg-ink-900/85 border-b border-steel-700/40 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
            : "bg-transparent"
        }
      `}
    >
      <Container className="flex items-center justify-between py-3 md:py-4">
        <Link href={routePaths.home} className="flex items-center gap-3 group">
          <img
            src={siteIdentity.logoImage}
            alt={`${siteIdentity.fullName} logo`}
            width={40}
            height={44}
            className="h-10 w-auto object-contain"
          />
          <span className="font-display text-lg sm:text-xl md:text-2xl font-bold text-parchment-100 group-hover:text-crimson-300 transition-colors">
            {siteIdentity.shortName}
          </span>
        </Link>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-steel-700 text-parchment-200"
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
            md:flex absolute md:static left-0 right-0 top-full
            flex-col md:flex-row md:items-center gap-1 md:gap-1
            bg-ink-900/95 md:bg-transparent border-b md:border-0 border-steel-700/50
            px-4 py-4 md:p-0
          `}
        >
          <ul className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
            {primaryNavigation.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`
                      block px-3 py-2.5 md:py-2 font-accent text-sm uppercase tracking-[0.16em]
                      transition-colors duration-300
                      ${
                        isActive
                          ? "text-crimson-400"
                          : "text-parchment-300 hover:text-parchment-100"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-3 md:mt-0 md:ml-4 flex items-center gap-2">
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
                  className="btn-secondary !px-4 !py-2 text-xs"
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
