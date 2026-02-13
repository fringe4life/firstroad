import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const MembershipsTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Username</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Joined At</TableHead>
        <TableHead>Verified</TableHead>
        <TableHead>Can Ticket Create?</TableHead>
        <TableHead>Can Ticket Update?</TableHead>
        <TableHead>Can Ticket Delete?</TableHead>
        <TableHead />
      </TableRow>
    </TableHeader>
  );
};

export { MembershipsTableHeader };
