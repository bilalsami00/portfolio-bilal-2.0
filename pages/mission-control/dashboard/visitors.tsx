import VisitorsPanel from "../../../components/admin/dashboard/VisitorsPanel";
import { getMissionControlLayout } from "../../../components/admin/dashboard/MissionControlLayout";
import type { NextPageWithLayout } from "../../../utilities/pageLayout";

const DashboardVisitorsPage: NextPageWithLayout = () => <VisitorsPanel />;

DashboardVisitorsPage.getLayout = getMissionControlLayout;

export default DashboardVisitorsPage;
