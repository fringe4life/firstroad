import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { MembershipsSkeletonProps } from "./memberships-skeleton";

const MembershipsListSkeleton = ({ rows = 5 }: MembershipsSkeletonProps) => (
  <TableBody>
    {Array.from({ length: rows }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: just a skeleton
      <TableRow className="h-[53px]" key={i}>
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
      </TableRow>
    ))}
  </TableBody>
);

export { MembershipsListSkeleton };
