import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const MembershipsTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Username</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Joined At</TableHead>
        <TableHead>Verified</TableHead>
        <TableHead>Can Delete Ticket?</TableHead>
        <TableHead>Can Update Ticket?</TableHead>
        <TableHead />
      </TableRow>
    </TableHeader>
  );
};

export { MembershipsTableHeader };
