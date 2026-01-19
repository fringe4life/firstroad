import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOrganisationById } from "@/features/organisation/queries/get-organisation-by-id";
import { MembershipList } from "./membership-list";

const Memberships = async ({ organisationId }: { organisationId: string }) => {
  const members = await getOrganisationById(organisationId);

  return (
    <Table className="h-full">
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Joined At</TableHead>
          <TableHead>Verified</TableHead>
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
