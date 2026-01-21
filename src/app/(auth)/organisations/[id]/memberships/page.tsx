import { connection } from "next/server";
import { Heading } from "@/components/heading";
import { Memberships } from "@/features/memberships/components/memberships";

const OrganisationDetailPage = async ({
  params,
}: PageProps<"/organisations/[id]/memberships">) => {
  await connection();
  const { id } = await params;
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
