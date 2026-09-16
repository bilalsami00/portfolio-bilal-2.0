import type { NextPage } from "next";
import Link from "next/link";
import PageShell from "../../components/layout";
import Container from "../../components/shared/Container";
import { ButtonLink } from "../../components/shared/Button";
import { routePaths } from "../../data/navigation";

/**
 * Admin login placeholder — no authentication features yet.
 */
const MissionControlLoginPage: NextPage = () => (
  <PageShell
    title="Mission Control"
    description="Admin login placeholder for future portfolio management."
    path={routePaths.missionControl}
    noIndex
  >
    <section className="py-16 sm:py-24 min-h-[60vh] flex items-center">
      <Container className="max-w-xl">
        <p className="section-eyebrow">Restricted</p>
        <div className="crimson-mark mt-4 mb-5" />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-parchment-100">
          Mission Control
        </h1>
        <p className="mt-4 text-parchment-400 leading-relaxed">
          Admin authentication is not implemented yet. This route is reserved
          for a future content dashboard.
        </p>

        <form
          className="mt-8 ink-panel p-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <label className="block" htmlFor="mission-control-email">
            <span className="mb-2 block text-xs font-accent uppercase tracking-[0.18em] text-steel-400">
              Email
            </span>
            <input
              id="mission-control-email"
              className="contact-field"
              type="email"
              placeholder="admin@example.com"
              disabled
            />
          </label>
          <label className="block" htmlFor="mission-control-password">
            <span className="mb-2 block text-xs font-accent uppercase tracking-[0.18em] text-steel-400">
              Password
            </span>
            <input
              id="mission-control-password"
              className="contact-field"
              type="password"
              placeholder="••••••••"
              disabled
            />
          </label>
          <button
            type="submit"
            className="btn-primary opacity-60 cursor-not-allowed"
            disabled
          >
            Sign in (coming soon)
          </button>
        </form>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink
            href={routePaths.missionControlDashboard}
            variant="secondary"
          >
            Preview dashboard shell
          </ButtonLink>
          <Link href={routePaths.home} className="btn-secondary">
            Return to portfolio
          </Link>
        </div>
      </Container>
    </section>
  </PageShell>
);

export default MissionControlLoginPage;
