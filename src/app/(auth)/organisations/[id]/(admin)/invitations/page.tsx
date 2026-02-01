import { connection } from "next/server";
import { Heading } from "@/components/heading";
import { Invitations } from "@/features/invitations/components/invitations";
import { getAdminOwnerOrRedirect } from "@/features/memberships/queries/get-admin-owner-or-redirect";
import { AdminTabs } from "../_components/admin-tabs";

const InvitationsPage = async ({
  params,
}: PageProps<"/organisations/[id]/invitations">) => {
  await connection();
  const { id } = await params;

  await getAdminOwnerOrRedirect(id);

  return (
    <div className="grid h-full grid-rows-[min-content_min-content_1fr] gap-y-8">
      <Heading
        description="Manage invitations to your organisation"
        tabs={<AdminTabs organizationId={id} />}
        title="Invitations"
      />
      <Invitations organizationId={id} />
    </div>
  );
};

export default InvitationsPage;
