import { TableBody, TableRow } from "@/components/ui/table";
import type { Rows } from "@/types";
import { OrganisationItemSkeleton } from "./organisation-item-skeleton";

interface OrganisationsListSkeletonProps extends Rows {}

const OrganisationsListSkeleton = ({
  rows = 5,
}: OrganisationsListSkeletonProps) => (
  <TableBody>
    {Array.from({ length: rows }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: just a skeleton
      <TableRow key={i}>
        <OrganisationItemSkeleton />
      </TableRow>
    ))}
  </TableBody>
);

export { OrganisationsListSkeleton };
