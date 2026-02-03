import { HeadingSkeleton } from "@/components/heading-skeleton";
import { InvitationsSkeleton } from "@/features/invitations/components/invitations-skeleton";

const InvitationsLoader = () => (
  <>
    <HeadingSkeleton showActions showTabs />
    <InvitationsSkeleton />
  </>
);

export default InvitationsLoader;
