import MessagesPanel from "../../../components/admin/dashboard/MessagesPanel";
import { getMissionControlLayout } from "../../../components/admin/dashboard/MissionControlLayout";
import type { NextPageWithLayout } from "../../../utilities/pageLayout";

const DashboardMessagesPage: NextPageWithLayout = () => <MessagesPanel />;

DashboardMessagesPage.getLayout = getMissionControlLayout;

export default DashboardMessagesPage;
