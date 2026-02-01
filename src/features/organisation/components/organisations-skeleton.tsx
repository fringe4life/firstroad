import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { OrganisationsTableHeader } from "./organisations-table-header";

interface OrganisationsSkeletonProps {
  rows?: number;
}

const OrganisationsSkeleton = ({ rows = 5 }: OrganisationsSkeletonProps) => {
  return (
    <Table>
      <OrganisationsTableHeader />
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: just a skeleton
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-20" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export { OrganisationsSkeleton };
