"use cache: remote";
import { Heading } from "@/components/heading";
import { InviteMemberButton } from "@/features/invitations/components/invite-member-button";
import type { OrganisationId } from "@/features/organisation/types";

interface MembershipsHeadingProps extends OrganisationId {}

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
