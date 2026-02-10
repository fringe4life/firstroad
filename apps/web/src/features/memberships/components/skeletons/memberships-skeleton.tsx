import { Table } from "@/components/ui/table";
import type { Rows } from "@/types";
import { MembershipsTableHeader } from "../memberships-table-header";
import { MembershipsListSkeleton } from "./memberships-list-skeleton";

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
