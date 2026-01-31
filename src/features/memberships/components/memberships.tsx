import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getUser } from "@/features/auth/queries/get-user";
import { MembershipList } from "@/features/memberships/components/membership-list";
import { getMembershipsById } from "@/features/memberships/queries/get-memberships-by-id";
import type { MemberShipProps } from "../types";

const Memberships = async ({ organizationId }: MemberShipProps) => {
  const members = await getMembershipsById(organizationId);
  const { user } = await getUser();
  const currentUserEmail = user?.email ?? null;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Joined At</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead>Can Delete Ticket?</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
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
