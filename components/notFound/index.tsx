import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { routePaths } from "../../data/navigation";
import { siteIdentity } from "../../data/site";
import Container from "../shared/Container";
import { Button, ButtonLink } from "../shared/Button";
import { PREV_PATH_KEY } from "../shared/PathMemory";

/** In-app path recorded before navigating to the missing URL, if any. */
const getSafeReturnPath = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const prev = sessionStorage.getItem(PREV_PATH_KEY);
    if (prev && prev.startsWith("/")) {
      const prevPath = prev.split("?")[0]?.split("#")[0] || prev;
      if (prevPath && prevPath !== window.location.pathname) {
        return prev;
      }
    }
  } catch {
    // Ignore storage failures.
  }

  const { referrer } = document;
  if (!referrer) return null;

  try {
    const refUrl = new URL(referrer);
    if (
      refUrl.origin === window.location.origin &&
      refUrl.pathname !== window.location.pathname
    ) {
      return `${refUrl.pathname}${refUrl.search}${refUrl.hash}`;
    }
  } catch {
    return null;
  }

  return null;
};

/**
 * Custom 404 — forge-aligned dead end with safe recovery actions.
 */
const NotFoundContent = () => {
  const router = useRouter();
  const [returnPath, setReturnPath] = useState<string | null>(null);

  useEffect(() => {
    setReturnPath(getSafeReturnPath());
  }, [router.asPath]);

  const handleGoBack = useCallback(() => {
    const target = getSafeReturnPath();
    if (target) {
      router.push(target).catch(() => undefined);
      return;
    }
    router.push(routePaths.home).catch(() => undefined);
  }, [router]);

  return (
    <section
      className="relative flex items-center py-16 sm:py-20 md:py-24 lg:py-28"
      aria-labelledby="not-found-title"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 35%, color-mix(in srgb, var(--color-crimson) 22%, transparent), transparent 62%)",
        }}
        aria-hidden
      />

      {/* Minimal broken-path motif */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[28%] flex justify-center opacity-40"
        aria-hidden
      >
        <svg
          width="220"
          height="24"
          viewBox="0 0 220 24"
          fill="none"
          className="text-steel-500"
        >
          <path
            d="M8 12h72"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="6 7"
          />
          <path
            d="M92 12h16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.35"
          />
          <circle
            cx="110"
            cy="12"
            r="3.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M122 12h16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.35"
          />
          <path
            d="M140 12h72"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="6 7"
          />
        </svg>
      </div>

      <Container className="relative w-full max-w-2xl text-center">
        <p
          className="font-display font-bold text-[clamp(4.5rem,18vw,9.5rem)] leading-none tracking-tight text-crimson-700/75 select-none"
          aria-hidden
        >
          404
        </p>

        <p className="section-eyebrow mt-4 sm:mt-5">Route not forged</p>
        <div className="crimson-mark mx-auto mt-4 mb-5" />

        <h1
          id="not-found-title"
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-parchment-100 leading-tight text-balance"
        >
          This page cannot be found
        </h1>

        <p className="mx-auto mt-5 max-w-md text-base sm:text-lg text-parchment-400 leading-relaxed text-pretty">
          The URL may be mistyped, moved, or never existed on{" "}
          {siteIdentity.siteName}. Use a known path to continue.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <ButtonLink
            href={routePaths.home}
            className="justify-center min-h-[2.75rem]"
          >
            Return home
          </ButtonLink>
          <Button
            type="button"
            variant="secondary"
            onClick={handleGoBack}
            className="justify-center min-h-[2.75rem]"
          >
            {returnPath ? "Go back" : "Back to home"}
          </Button>
        </div>

        <nav
          className="mt-10 text-sm text-steel-500"
          aria-label="Additional pages"
        >
          <Link href={routePaths.about} className="site-text-link">
            About
          </Link>
          <span className="mx-2 text-steel-600" aria-hidden>
            ·
          </span>
          <Link href={routePaths.projects} className="site-text-link">
            Projects
          </Link>
          <span className="mx-2 text-steel-600" aria-hidden>
            ·
          </span>
          <Link href={routePaths.contact} className="site-text-link">
            Contact
          </Link>
        </nav>
      </Container>
    </section>
  );
};

export default NotFoundContent;
