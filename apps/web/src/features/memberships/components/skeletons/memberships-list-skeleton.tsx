import { TableBody, TableRow } from "@/components/ui/table";
import { MembershipsListItemSkeleton } from "./memberships-list-item-skeleton";
import type { MembershipsSkeletonProps } from "./memberships-skeleton";

const MembershipsListSkeleton = ({ rows = 5 }: MembershipsSkeletonProps) => (
  <TableBody>
    {Array.from({ length: rows }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: just a skeleton
      <TableRow className="h-[53px]" key={i}>
        <MembershipsListItemSkeleton />
      </TableRow>
    ))}
  </TableBody>
);

export { MembershipsListSkeleton };
