import { connection } from "next/server";
import { Suspend } from "@/components/suspend";
import { Invitations } from "@/features/invitations/components/invitations";
import { InvitationsHeading } from "@/features/invitations/components/invitations-heading";
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
      <InvitationsHeading organizationId={id} />
      <Suspend fallback={<InvitationsSkeleton />}>
        <Invitations organizationId={id} />
      </Suspend>
    </>
  );
};

export default InvitationsPage;
