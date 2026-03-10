"use cache: remote";
import { Heading } from "@/components/heading";
import { InviteMemberButton } from "@/features/invitations/components/invite-member-button";

interface MembershipsHeadingProps {
  organizationId: string;
}

const MembershipsHeading = async ({
  organizationId,
}: MembershipsHeadingProps) => (
  <Heading
    actions={<InviteMemberButton organizationId={organizationId} />}
    description="Manage your members"
    title="Memberships"
  />
);

export { MembershipsHeading };
