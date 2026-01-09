import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { OrganisationList } from "@/features/organisation/components/organisation-list";
import { getOrganisationByUser } from "@/features/organisation/queries/get-organisations-for-user";

const Organisations = async () => {
  const user = await getUserOrRedirect({ checkOrganistation: false });
  const organisations = await getOrganisationByUser();
  const activeOrganizationId = user.activeOrganizationId;

  return (
    <Table className="h-full">
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Joined At</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>{""}</TableHead>
        </TableRow>
      </TableHeader>
      <OrganisationList
        activeOrganizationId={activeOrganizationId}
        emptyStateMessage="No organisations found"
        errorStateMessage="Failed to fetch organisations"
        organisations={organisations}
      />
    </Table>
  );
};

export { Organisations };
