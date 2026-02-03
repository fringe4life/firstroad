import { connection } from "next/server";
import { Heading } from "@/components/heading";
import { Suspend } from "@/components/suspend";
import { Invitations } from "@/features/invitations/components/invitations";
import { InvitationsSkeleton } from "@/features/invitations/components/invitations-skeleton";
import { InviteMemberButton } from "@/features/invitations/components/invite-member-button";
import { getAdminOwnerOrRedirect } from "@/features/memberships/queries/get-admin-owner-or-redirect";
import { AdminTabs } from "../_components/admin-tabs";

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
        description="Manage invitations to your organisation"
        tabs={<AdminTabs organizationId={id} />}
        title="Invitations"
      />
      <Suspend fallback={<InvitationsSkeleton />}>
        <Invitations organizationId={id} />
      </Suspend>
    </>
  );
};

export default InvitationsPage;
