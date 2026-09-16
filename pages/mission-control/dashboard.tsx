import type { NextPage } from "next";
import Link from "next/link";
import PageShell from "../../components/layout";
import Container from "../../components/shared/Container";
import { routePaths } from "../../data/navigation";

/**
 * Dashboard placeholder — structure only, no admin features.
 */
const MissionControlDashboardPage: NextPage = () => (
  <PageShell
    title="Mission Control Dashboard"
    description="Placeholder dashboard shell for future portfolio administration."
    path={routePaths.missionControlDashboard}
    noIndex
  >
    <section className="py-16 sm:py-20 min-h-[60vh]">
      <Container>
        <p className="section-eyebrow">Mission Control</p>
        <div className="crimson-mark mt-4 mb-5" />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-parchment-100">
          Dashboard placeholder
        </h1>
        <p className="mt-4 max-w-2xl text-parchment-400 leading-relaxed">
          Future modules could include project CRUD, experience editing, and
          message inbox. Nothing is functional here yet — this page only
          reserves the route.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Projects",
            "Experience",
            "Messages",
            "Media",
            "Settings",
            "Analytics",
          ].map((moduleName) => (
            <div key={moduleName} className="ink-panel p-5 opacity-80">
              <h2 className="font-display text-lg text-parchment-100 font-bold">
                {moduleName}
              </h2>
              <p className="mt-2 text-sm text-steel-400">
                Module reserved · not implemented
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link href={routePaths.missionControl} className="btn-secondary">
            Back to login shell
          </Link>
        </div>
      </Container>
    </section>
  </PageShell>
);

export default MissionControlDashboardPage;
