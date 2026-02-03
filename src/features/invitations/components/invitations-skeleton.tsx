import { Table } from "@/components/ui/table";
import type { Rows } from "@/types";
import { InvitationsListSkeleton } from "./invitations-list-skeleton";
import { InvitationsTableHeader } from "./invitations-table-header";

export interface InvitationsSkeletonProps extends Rows {}

const InvitationsSkeleton = ({ rows = 5 }: InvitationsSkeletonProps) => {
  return (
    <Table>
      <InvitationsTableHeader />
      <InvitationsListSkeleton rows={rows} />
    </Table>
  );
};

export { InvitationsSkeleton };
