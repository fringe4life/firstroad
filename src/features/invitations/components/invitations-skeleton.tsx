import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { InvitationsTableHeader } from "./invitations-table-header";

interface InvitationsSkeletonProps {
  rows?: number;
}

const InvitationsSkeleton = ({ rows = 5 }: InvitationsSkeletonProps) => {
  return (
    <Table>
      <InvitationsTableHeader />
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: just a skeleton
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-48" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export { InvitationsSkeleton };
