import { Table } from "@/components/ui/table";
import type { Rows } from "@/types";
import { OrganisationsTableHeader } from "../organisations-table-header";
import { OrganisationsListSkeleton } from "./organisations-list-skeleton";

interface OrganisationsSkeletonProps extends Rows {}

const OrganisationsSkeleton = ({ rows = 5 }: OrganisationsSkeletonProps) => (
  <Table>
    <OrganisationsTableHeader />
    <OrganisationsListSkeleton rows={rows} />
  </Table>
);

export { OrganisationsSkeleton };
