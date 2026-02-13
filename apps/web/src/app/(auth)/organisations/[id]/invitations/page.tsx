import { connection } from "next/server";
import { Heading } from "@/components/heading";
import { Suspend } from "@/components/suspend";
import { Invitations } from "@/features/invitations/components/invitations";
import { InviteMemberButton } from "@/features/invitations/components/invite-member-button";
import { InvitationsSkeleton } from "@/features/invitations/components/skeletons/invitations-skeleton";
import { getAdminOwnerOrRedirect } from "@/features/memberships/queries/get-admin-owner-or-redirect";

const InvitationsPage = async ({
  params,
}: PageProps<"/organisations/[id]/invitations">) => {
  await connection();
  const { id } = await params;

  await getAdminOwnerOrRedirect(id);

  return (
    <>
      <Heading
        actions={<InviteMemberButton organizationId={id} />}
        description="Manage invitations"
        title="Invitations"
      />
      <Suspend fallback={<InvitationsSkeleton />}>
        <Invitations organizationId={id} />
      </Suspend>
    </>
  );
};

export default InvitationsPage;
