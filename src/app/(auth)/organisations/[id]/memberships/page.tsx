import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Heading } from "@/components/heading";
import { Memberships } from "@/features/memberships/components/memberships";
import { getMemberRole } from "@/features/memberships/queries/get-member-role";
import { organisationsPath } from "@/path";

const OrganisationDetailPage = async ({
  params,
}: PageProps<"/organisations/[id]/memberships">) => {
  await connection();
  const { id } = await params;

  // Check if user has admin or owner role for this organization
  const role = await getMemberRole(id);

  // Redirect if user doesn't have membership or is not admin/owner
  if (!role || (role !== "admin" && role !== "owner")) {
    redirect(organisationsPath());
  }

  return (
    <div className="grid h-full grid-rows-[min-content_min-content_1fr] gap-y-8">
      <Heading
        description="Manage memberships in your organisation"
        title="Memberships"
      />
      <Memberships organisationId={id} />
    </div>
  );
};

export default OrganisationDetailPage;
