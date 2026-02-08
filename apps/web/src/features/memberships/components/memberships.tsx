import { Table } from "@/components/ui/table";
import { getUser } from "@/features/auth/queries/get-user";
import { MembershipList } from "@/features/memberships/components/membership-list";
import { getMembershipsById } from "@/features/memberships/queries/get-memberships-by-id";
import type { MemberShipProps } from "../types";
import { MembershipsTableHeader } from "./memberships-table-header";

const Memberships = async ({ organizationId }: MemberShipProps) => {
  const members = await getMembershipsById(organizationId);
  const { user } = await getUser();
  const currentUserEmail = user?.email ?? null;

  return (
    <Table>
      <MembershipsTableHeader />
      <MembershipList
        currentUserEmail={currentUserEmail}
        emptyStateMessage="No members found"
        errorStateMessage="Failed to fetch members"
        members={members}
        organizationId={organizationId}
      />
    </Table>
  );
};

export { Memberships };
