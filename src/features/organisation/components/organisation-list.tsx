import { GenericComponent } from "@/components/generic-component";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrganisationItem } from "@/features/organisation/components/organisation-item";
import { getOrganisationByUser } from "@/features/organisation/queries/get-organisations-for-user";

const OrganisationList = async () => {
  const organisations = await getOrganisationByUser();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Joined At</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>""</TableHead>
        </TableRow>
      </TableHeader>
      <GenericComponent
        as="tbody"
        Component={OrganisationItem}
        emptyStateMessage="No organisations found"
        errorStateMessage="Failed to fetch organisations"
        items={organisations}
        renderProps={(organisation) => ({ organisation })}
      />
    </Table>
  );
};

export { OrganisationList };
