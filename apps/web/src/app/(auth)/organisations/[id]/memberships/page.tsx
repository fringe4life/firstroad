import { connection } from "next/server";
import { Suspend } from "@/components/suspend";
import { Memberships } from "@/features/memberships/components/memberships";
import { MembershipsHeading } from "@/features/memberships/components/memberships-heading";
import { MembershipsSkeleton } from "@/features/memberships/components/skeletons/memberships-skeleton";
import { getAdminOwnerOrRedirect } from "@/features/memberships/queries/get-admin-owner-or-redirect";

const OrganisationDetailPage = async ({
  params,
}: PageProps<"/organisations/[id]/memberships">) => {
  // react-doctor-disable-next-line
  await connection();
  // react-doctor-disable-next-line
  const { id } = await params;

  await getAdminOwnerOrRedirect(id);

  return (
    <>
      <MembershipsHeading organizationId={id} />
      <Suspend fallback={<MembershipsSkeleton />}>
        <Memberships organizationId={id} />
      </Suspend>
    </>
  );
};

export default OrganisationDetailPage;
