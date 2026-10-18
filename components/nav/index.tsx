import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { primaryNavigation, routePaths } from "../../data/navigation";
import { siteIdentity } from "../../data/site";
import useIsScrolled from "../../hooks/useIsScrolled";
import Container from "../shared/Container";
import ThemeToggle from "../shared/ThemeToggle";
import MenuIcon from "../svgs/menuIcon";
import XIcon from "../svgs/xIcon";

const DESKTOP_NAV_QUERY = "(min-width: 768px)";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

const isVisible = (element: HTMLElement) => {
  if (element.getAttribute("aria-hidden") === "true") return false;
  return element.getClientRects().length > 0;
};

/**
 * Site-wide sticky navigation with theme toggle.
 */
const SiteNavigation = () => {
  const router = useRouter();
  const isScrolled = useIsScrolled(24);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeReasonRef = useRef<"dismiss" | "navigate">("dismiss");
  const navigatingRef = useRef(false);

  useEffect(() => {
    const onStart = () => {
      navigatingRef.current = true;
    };
    const onDone = () => {
      navigatingRef.current = false;
      setMenuOpen(false);
    };

    router.events.on("routeChangeStart", onStart);
    router.events.on("routeChangeComplete", onDone);
    router.events.on("routeChangeError", onDone);
    return () => {
      router.events.off("routeChangeStart", onStart);
      router.events.off("routeChangeComplete", onDone);
      router.events.off("routeChangeError", onDone);
    };
  }, [router.events]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const desktopQuery = window.matchMedia(DESKTOP_NAV_QUERY);
    if (desktopQuery.matches) {
      setMenuOpen(false);
      return undefined;
    }

    const { documentElement } = document;
    const previousOverflow = documentElement.style.overflow;

    /* Root overflow stops scrolling and pauses Lenis without moving scrollY.
       The open header is position:fixed, so Lenis's stopped overflow:clip
       cannot slide a sticky bar off the viewport. */
    documentElement.style.overflow = "hidden";

    const stopBackgroundScroll = (event: Event) => {
      const panel = document.getElementById("primary-navigation");
      if (event.target instanceof Node && panel?.contains(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener("wheel", stopBackgroundScroll, {
      capture: true,
      passive: false,
    });
    window.addEventListener("touchmove", stopBackgroundScroll, {
      capture: true,
      passive: false,
    });

    const onDesktop = () => {
      if (desktopQuery.matches) setMenuOpen(false);
    };
    desktopQuery.addEventListener("change", onDesktop);

    return () => {
      desktopQuery.removeEventListener("change", onDesktop);
      window.removeEventListener("wheel", stopBackgroundScroll, true);
      window.removeEventListener("touchmove", stopBackgroundScroll, true);
      documentElement.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const header = headerRef.current;
    if (!header || window.matchMedia(DESKTOP_NAV_QUERY).matches)
      return undefined;

    closeReasonRef.current = "dismiss";
    const inerted: Element[] = [];
    const parent = header.parentElement;
    if (parent) {
      Array.from(parent.children).forEach((child) => {
        if (child !== header && !child.hasAttribute("inert")) {
          child.setAttribute("inert", "");
          inerted.push(child);
        }
      });
    }

    const focusable = () =>
      Array.from(
        header.querySelectorAll<HTMLElement>(focusableSelector)
      ).filter(isVisible);

    const menuButton = menuButtonRef.current;
    menuButton?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeReasonRef.current = "dismiss";
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !header.contains(active))) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (
        !event.shiftKey &&
        (active === last || !header.contains(active))
      ) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      inerted.forEach((element) => element.removeAttribute("inert"));
      const returnFocus =
        closeReasonRef.current === "dismiss" &&
        menuButton &&
        document.contains(menuButton) &&
        !window.matchMedia(DESKTOP_NAV_QUERY).matches;
      if (returnFocus) {
        menuButton.focus({ preventScroll: true });
      }
    };
  }, [menuOpen]);

  const closeForNavigation = () => {
    closeReasonRef.current = "navigate";
    setMenuOpen(false);
  };

  let headerSurface = "";
  if (menuOpen) {
    headerSurface = "site-header--menu";
  } else if (isScrolled) {
    headerSurface = "site-header--scrolled";
  }

  return (
    <header
      ref={headerRef}
      className={`site-header z-50 ${
        menuOpen ? "site-header--menu" : "sticky top-0"
      } ${headerSurface}`}
      role={menuOpen ? "dialog" : undefined}
      aria-modal={menuOpen ? true : undefined}
      aria-label={menuOpen ? "Site menu" : undefined}
    >
      <Container
        className={`site-header-inner flex items-center justify-between py-3 md:py-3.5 ${
          menuOpen ? "max-md:items-stretch" : ""
        }`}
      >
        <div
          className={`flex w-full shrink-0 items-center justify-between md:w-auto ${
            menuOpen ? "py-3 md:py-0" : ""
          }`}
        >
          <Link
            href={routePaths.home}
            className="flex items-center gap-3 group min-h-[2.75rem]"
            onClick={closeForNavigation}
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
              ref={menuButtonRef}
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
              onClick={() => {
                closeReasonRef.current = "dismiss";
                setMenuOpen((open) => !open);
              }}
            >
              {menuOpen ? (
                <XIcon color="currentColor" />
              ) : (
                <MenuIcon color="currentColor" />
              )}
            </button>
          </div>
        </div>

        <nav
          id="primary-navigation"
          className={`
            ${
              menuOpen
                ? "mobile-menu-panel flex w-full min-h-0 flex-1 flex-col overflow-y-auto"
                : "hidden"
            }
            md:flex md:static md:w-auto md:min-h-0 md:max-h-none md:flex-none md:flex-row md:items-center md:overflow-visible md:bg-transparent md:border-0 md:p-0
            gap-1 md:gap-1
            bg-ink-900 border-b border-steel-700/50
            px-4 xs:px-5 sm:px-6 py-5 md:p-0
          `}
          data-lenis-prevent
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
                    onClick={closeForNavigation}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 pt-4 md:mt-0 md:pt-0 md:ml-3 border-t md:border-0 border-steel-700/40 flex items-center gap-2">
            <span className="hidden md:inline-flex">
              <ThemeToggle className="nav-theme-toggle" />
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
