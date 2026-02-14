import { Table } from "@/components/ui/table";
import { getInvitationsById } from "../queries/get-invitations-by-id";
import type { InvitationsProps } from "../types";
import { InvitationList } from "./invitation-list";
import { InvitationsTableHeader } from "./invitations-table-header";

const Invitations = async ({ organizationId }: InvitationsProps) => {
  const invitations = await getInvitationsById(organizationId);

  return (
    <Table className="has-unsuccessful:h-full">
      <InvitationsTableHeader />
      <InvitationList
        emptyStateMessage="No invitations found"
        errorStateMessage="Failed to fetch invitations"
        invitations={invitations}
        organizationId={organizationId}
      />
    </Table>
  );
};

export { Invitations };
