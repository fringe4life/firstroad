import { Table } from "@/components/ui/table";
import type { Rows } from "@/types";
import { MembershipsListSkeleton } from "./memberships-list-skeleton";
import { MembershipsTableHeader } from "./memberships-table-header";

export interface MembershipsSkeletonProps extends Rows {}

const MembershipsSkeleton = ({ rows = 5 }: MembershipsSkeletonProps) => {
  return (
    <Table>
      <MembershipsTableHeader />
      <MembershipsListSkeleton rows={rows} />
    </Table>
  );
};

export { MembershipsSkeleton };
