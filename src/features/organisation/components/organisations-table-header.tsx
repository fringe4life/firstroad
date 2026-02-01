import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const OrganisationsTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>ID</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Joined At</TableHead>
        <TableHead>Members</TableHead>
        <TableHead>My Role</TableHead>
        <TableHead />
      </TableRow>
    </TableHeader>
  );
};

export { OrganisationsTableHeader };
