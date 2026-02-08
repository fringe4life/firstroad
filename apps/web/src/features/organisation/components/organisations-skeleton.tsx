import { Table } from "@/components/ui/table";
import type { Rows } from "@/types";
import { OrganisationsListSkeleton } from "./organisations-list-skeleton";
import { OrganisationsTableHeader } from "./organisations-table-header";

interface OrganisationsSkeletonProps extends Rows {}

const OrganisationsSkeleton = ({ rows = 5 }: OrganisationsSkeletonProps) => (
  <Table>
    <OrganisationsTableHeader />
    <OrganisationsListSkeleton rows={rows} />
  </Table>
);

export { OrganisationsSkeleton };
