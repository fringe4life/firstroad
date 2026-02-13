import { Heading } from "@/components/heading";
import { ActionsSkeleton } from "@/components/skeletons/actions-skeleton";
import { MembershipsSkeleton } from "@/features/memberships/components/skeletons/memberships-skeleton";

const MembershipsLoading = () => (
  <>
    <Heading
      actions={<ActionsSkeleton />}
      description="Manage memberships in your organisation"
      title="Memberships"
    />
    <MembershipsSkeleton />
  </>
);

export default MembershipsLoading;
