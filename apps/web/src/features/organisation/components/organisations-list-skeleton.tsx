import { IconButtonSkeleton } from "@/components/skeletons/icon-button-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { Rows } from "@/types";

interface OrganisationsListSkeletonProps extends Rows {}

const OrganisationsListSkeleton = ({
  rows = 5,
}: OrganisationsListSkeletonProps) => (
  <TableBody>
    {Array.from({ length: rows }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: just a skeleton
      <TableRow key={i}>
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
            <IconButtonSkeleton />
            <IconButtonSkeleton />
          </div>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
);

export { OrganisationsListSkeleton };
