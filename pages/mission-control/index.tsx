import { useRouter } from "next/router";
import { useEffect } from "react";
import PageShell from "../../components/layout";
import Container from "../../components/shared/Container";
import AdminLoginForm from "../../components/admin/AdminLoginForm";
import {
  AdminAuthProvider,
  useAdminAuth,
} from "../../components/admin/AdminAuthProvider";
import MaskedNotFound from "../../components/admin/MaskedNotFound";
import { routePaths } from "../../data/navigation";
import type { NextPageWithLayout } from "../../utilities/pageLayout";

const MissionControlLogin = () => {
  const router = useRouter();
  const { status } = useAdminAuth();

  useEffect(() => {
    if (status === "authorized") {
      router.replace(routePaths.missionControlMessages).catch(() => undefined);
    }
  }, [status, router]);

  if (status === "unauthorized") return <MaskedNotFound />;

  const checking = status === "loading" || status === "authorized";
  let notice: string | null = null;
  if (status === "not-configured") {
    notice = "Admin sign-in is not configured.";
  } else if (status === "error") {
    notice =
      "Could not verify your session. Check your connection and sign in again.";
  }

  return (
    <PageShell
      title="Mission Control"
      description="Restricted area."
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

          {checking ? (
            <p
              className="mt-8 ink-panel p-6 text-sm text-parchment-400"
              role="status"
            >
              {status === "authorized"
                ? "Opening dashboard…"
                : "Checking session…"}
            </p>
          ) : (
            <AdminLoginForm
              disabled={status === "not-configured"}
              notice={notice}
            />
          )}
        </Container>
      </section>
    </PageShell>
  );
};

const MissionControlLoginPage: NextPageWithLayout = () => (
  <MissionControlLogin />
);

MissionControlLoginPage.getLayout = (page) => (
  <AdminAuthProvider>{page}</AdminAuthProvider>
);

export default MissionControlLoginPage;
