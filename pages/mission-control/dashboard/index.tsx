import { useRouter } from "next/router";
import { useEffect } from "react";
import { getMissionControlLayout } from "../../../components/admin/dashboard/MissionControlLayout";
import { routePaths } from "../../../data/navigation";
import type { NextPageWithLayout } from "../../../utilities/pageLayout";

/** Rendered only inside the admin gate, so guests never get redirected. */
const DashboardIndexPage: NextPageWithLayout = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace(routePaths.missionControlMessages).catch(() => undefined);
  }, [router]);

  return null;
};

DashboardIndexPage.getLayout = getMissionControlLayout;

export default DashboardIndexPage;
