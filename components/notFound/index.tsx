import Link from "next/link";
import { useRouter } from "next/router";
import { routePaths } from "../../data/navigation";
import Container from "../shared/Container";
import { ButtonLink } from "../shared/Button";

/**
 * Custom 404 — intentional dark-fantasy dead end with clear exits.
 */
const NotFoundContent = () => {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(routePaths.home).catch(() => undefined);
  };

  return (
    <section
      className="relative min-h-[70vh] flex items-center py-16 sm:py-24"
      aria-labelledby="not-found-title"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(185,28,44,0.18), transparent 55%)",
        }}
        aria-hidden
      />

      <Container className="relative text-center">
        <p
          className="font-display text-[6rem] sm:text-[8rem] md:text-[10rem] leading-none text-crimson-700/80 select-none"
          aria-hidden
        >
          404
        </p>
        <p className="section-eyebrow mt-2">Path lost in the mist</p>
        <div className="crimson-mark mx-auto mt-4 mb-5" />
        <h1
          id="not-found-title"
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-parchment-100"
        >
          This route does not exist
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-parchment-400 leading-relaxed">
          The page may have been moved, renamed, or never forged. Choose a known
          path below.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <ButtonLink href={routePaths.home} className="justify-center">
            Return home
          </ButtonLink>
          <ButtonLink
            href={routePaths.projects}
            variant="secondary"
            className="justify-center"
          >
            View projects
          </ButtonLink>
          <button
            type="button"
            onClick={handleGoBack}
            className="btn-secondary justify-center"
          >
            Back
          </button>
        </div>

        <p className="mt-10 text-sm text-steel-500">
          Or jump to{" "}
          <Link
            href={routePaths.about}
            className="text-crimson-400 hover:text-crimson-300 underline-offset-2 hover:underline"
          >
            About
          </Link>{" "}
          /{" "}
          <Link
            href={routePaths.contact}
            className="text-crimson-400 hover:text-crimson-300 underline-offset-2 hover:underline"
          >
            Contact
          </Link>
        </p>
      </Container>
    </section>
  );
};

export default NotFoundContent;
