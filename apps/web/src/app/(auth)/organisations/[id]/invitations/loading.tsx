import { Heading } from "@/components/heading";
import { ActionsSkeleton } from "@/components/skeletons/actions-skeleton";
import { InvitationsSkeleton } from "@/features/invitations/components/skeletons/invitations-skeleton";

const InvitationsLoader = () => (
  <>
    <Heading
      actions={<ActionsSkeleton />}
      description="Manage invitations"
      title="Invitations"
    />
    <InvitationsSkeleton />
  </>
);

export default InvitationsLoader;
