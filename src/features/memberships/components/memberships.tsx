import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getUser } from "@/features/auth/queries/get-user";
import { MembershipList } from "@/features/memberships/components/membership-list";
import { getMembershipsById } from "@/features/memberships/queries/get-memberships-by-id";

const Memberships = async ({ organisationId }: { organisationId: string }) => {
  const members = await getMembershipsById(organisationId);
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
          <TableHead />
        </TableRow>
      </TableHeader>
      <MembershipList
        currentUserEmail={currentUserEmail}
        emptyStateMessage="No members found"
        errorStateMessage="Failed to fetch members"
        members={members}
        organisationId={organisationId}
      />
    </Table>
  );
};

export { Memberships };
