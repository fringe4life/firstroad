import { Heading } from "@/components/heading";
import { ActionsSkeleton } from "@/components/skeletons/actions-skeleton";
import { TabsSkeleton } from "@/components/skeletons/tabs-skeleton";
import { MembershipsSkeleton } from "@/features/memberships/components/memberships-skeleton";

const MembershipsLoading = () => (
  <>
    <Heading
      actions={<ActionsSkeleton />}
      description="Manage memberships in your organisation"
      tabs={<TabsSkeleton />}
      title="Memberships"
    />
    <MembershipsSkeleton />
  </>
);

export default MembershipsLoading;
