import { Heading } from "@/components/heading";
import { ActionsSkeleton } from "@/components/skeletons/actions-skeleton";
import { TabsSkeleton } from "@/components/skeletons/tabs-skeleton";
import { InvitationsSkeleton } from "@/features/invitations/components/invitations-skeleton";

const InvitationsLoader = () => (
  <>
    <Heading
      actions={<ActionsSkeleton />}
      description="Manage invitations to your organisation"
      tabs={<TabsSkeleton />}
      title="Invitations"
    />
    <InvitationsSkeleton />
  </>
);

export default InvitationsLoader;
