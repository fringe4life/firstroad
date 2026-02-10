import { TableBody, TableRow } from "@/components/ui/table";
import { InvitationsListItemSkeleton } from "./invitations-list-item-skeleton";
import type { InvitationsSkeletonProps } from "./invitations-skeleton";

const InvitationsListSkeleton = ({ rows = 5 }: InvitationsSkeletonProps) => (
  <TableBody>
    {Array.from({ length: rows }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: just a skeleton
      <TableRow className="h-[53px]" key={i}>
        <InvitationsListItemSkeleton />
      </TableRow>
    ))}
  </TableBody>
);

export { InvitationsListSkeleton };
