import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MembershipList } from "@/features/memberships/components/membership-list";
import { getMembershipsById } from "@/features/memberships/queries/get-memberships-by-id";

const Memberships = async ({ organisationId }: { organisationId: string }) => {
  const members = await getMembershipsById(organisationId);

  return (
    <Table className="h-full">
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
        emptyStateMessage="No members found"
        errorStateMessage="Failed to fetch members"
        members={members}
      />
    </Table>
  );
};

export { Memberships };
