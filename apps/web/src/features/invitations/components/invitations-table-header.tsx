import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const InvitationsTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Email</TableHead>
        <TableHead>Invited At</TableHead>
        <TableHead>Invited By</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export { InvitationsTableHeader };
