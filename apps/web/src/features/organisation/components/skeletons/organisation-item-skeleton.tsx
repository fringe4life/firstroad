import { IconButtonSkeleton } from "@/components/skeletons/icon-button-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell } from "@/components/ui/table";

const OrganisationItemSkeleton = () => (
  <>
    <TableCell>
      <Skeleton className="h-4 w-70" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-25" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-32" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-10" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-16" />
    </TableCell>
    <TableCell>
      <div className="flex gap-x-2">
        <IconButtonSkeleton />
        <IconButtonSkeleton />
        <IconButtonSkeleton />
        <Skeleton className="aspect-square h-10 bg-destructive/50" />
        <Skeleton className="aspect-square h-10 bg-destructive/50" />
      </div>
    </TableCell>
  </>
);

export { OrganisationItemSkeleton };
