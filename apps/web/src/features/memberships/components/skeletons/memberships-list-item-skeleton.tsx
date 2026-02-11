import { Skeleton } from "@/components/ui/skeleton";
import { TableCell } from "@/components/ui/table";

const MembershipsListItemSkeleton = () => (
  <>
    <TableCell>
      <Skeleton className="h-4 w-32" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-48" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-32" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-16" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-20" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-20" />
    </TableCell>
    <TableCell>
      <div className="flex gap-x-2">
        <Skeleton className="aspect-square h-10" />
        <Skeleton className="aspect-square h-10" />
      </div>
    </TableCell>
  </>
);

export { MembershipsListItemSkeleton };
