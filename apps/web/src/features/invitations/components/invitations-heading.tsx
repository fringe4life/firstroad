"use cache: remote";
import { Heading } from "@/components/heading";
import { InviteMemberButton } from "@/features/invitations/components/invite-member-button";

interface InvitationsHeadingProps {
  organizationId: string;
}

const InvitationsHeading = async ({
  organizationId,
}: InvitationsHeadingProps) => (
  <Heading
    actions={<InviteMemberButton organizationId={organizationId} />}
    description="Manage invitations"
    title="Invitations"
  />
);

export { InvitationsHeading };
