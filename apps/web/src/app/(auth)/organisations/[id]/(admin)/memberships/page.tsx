import { connection } from "next/server";
import { Heading } from "@/components/heading";
import { Suspend } from "@/components/suspend";
import { InviteMemberButton } from "@/features/invitations/components/invite-member-button";
import { Memberships } from "@/features/memberships/components/memberships";
import { MembershipsSkeleton } from "@/features/memberships/components/skeletons/memberships-skeleton";
import { getAdminOwnerOrRedirect } from "@/features/memberships/queries/get-admin-owner-or-redirect";
import { AdminTabs } from "../_components/admin-tabs";

const OrganisationDetailPage = async ({
  params,
}: PageProps<"/organisations/[id]/memberships">) => {
  await connection();
  const { id } = await params;

  await getAdminOwnerOrRedirect(id);

  return (
    <>
      <Heading
        actions={<InviteMemberButton organizationId={id} />}
        description="Manage your members"
        tabs={<AdminTabs organizationId={id} />}
        title="Memberships"
      />
      <Suspend fallback={<MembershipsSkeleton />}>
        <Memberships organizationId={id} />
      </Suspend>
    </>
  );
};

export default OrganisationDetailPage;
