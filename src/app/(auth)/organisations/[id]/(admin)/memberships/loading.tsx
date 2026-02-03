import { HeadingSkeleton } from "@/components/heading-skeleton";
import { MembershipsSkeleton } from "@/features/memberships/components/memberships-skeleton";

const MembershipsLoading = () => (
  <>
    <HeadingSkeleton showActions showTabs />
    <MembershipsSkeleton />
  </>
);

export default MembershipsLoading;
