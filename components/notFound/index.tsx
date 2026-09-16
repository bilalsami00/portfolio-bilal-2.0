import Link from "next/link";
import { useRouter } from "next/router";
import Button from "../buttons/button";
import Container from "../container";
import { homePath, projectsPath } from "../../utilities/paths";
import styles from "../../styles/notFound.module.css";

/**
 * Custom Not Found content.
 * Reuses portfolio layout primitives (Container, Button, route constants)
 * with a slightly darker atmosphere that can grow into the future visual identity.
 */
const NotFoundContent = () => {
  const router = useRouter();

  const handleGoBack = () => {
    // Prefer true history when available; otherwise land on Home safely.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(homePath).catch(() => undefined);
  };

  return (
    <section className={styles.notFoundShell} aria-labelledby="not-found-title">
      <Container
        className={`${styles.notFoundContent} w-full py-16 sm:py-20 md:py-24 text-center`}
      >
        <p className={styles.statusMark} aria-hidden="true">
          404
        </p>

        <p className="mt-2 text-primary-300 font-bold text-sm sm:text-base uppercase tracking-[0.2em]">
          Route unavailable
        </p>

        <h1
          id="not-found-title"
          className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white josefinSans"
        >
          Page Not Found
        </h1>

        <p className="mt-5 mx-auto max-w-[34rem] text-sm sm:text-base text-slate-300 leading-relaxed px-1">
          The page you requested does not exist, may have been moved, or is no
          longer available. Use one of the options below to continue exploring
          the portfolio.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4">
          <Link href={homePath} className="inline-flex justify-center">
            <Button className="uppercase w-full sm:w-auto justify-center min-w-[10rem]">
              Home
            </Button>
          </Link>

          <Link href={projectsPath} className="inline-flex justify-center">
            <Button
              colorClass="bg-slate-800 active:bg-slate-950 hover:bg-slate-700"
              className="uppercase w-full sm:w-auto justify-center min-w-[10rem]"
            >
              Projects
            </Button>
          </Link>

          <button
            type="button"
            onClick={handleGoBack}
            className="
              uppercase
              font-bold
              py-2
              px-4
              rounded
              min-w-[10rem]
              w-full
              sm:w-auto
              border
              border-primary-500/40
              text-primary-200
              hover:text-white
              hover:border-primary-400
              hover:bg-primary-500/10
              transition-all
              duration-300
              ease-out
            "
          >
            Go Back
          </button>
        </div>
      </Container>
    </section>
  );
};

export default NotFoundContent;
