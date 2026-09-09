import { TabsSkeleton } from "@/components/skeletons/tabs-skeleton";
import { Suspend } from "@/components/suspend";
import { AdminTabs } from "../_components/admin-tabs";

const AdminTabsSlot = () => (
  <Suspend fallback={<TabsSkeleton />}>
    <AdminTabs />
  </Suspend>
);

export default AdminTabsSlot;
