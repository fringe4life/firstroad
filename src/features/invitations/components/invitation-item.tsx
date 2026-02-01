import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import type { InvitationItemProps } from "../types";
import { InvitationCancelButton } from "./invitation-cancel-button";

const InvitationItem = ({
  invitation,
  organizationId,
}: InvitationItemProps) => {
  return (
    <TableRow>
      <TableCell>{invitation.email}</TableCell>
      <TableCell>{format(invitation.invitedAt, "dd/MM/yyyy, HH:mm")}</TableCell>
      <TableCell>{invitation.inviterName ?? "Unknown"}</TableCell>
      <TableCell>
        <InvitationCancelButton
          invitationId={invitation.id}
          organizationId={organizationId}
        />
      </TableCell>
    </TableRow>
  );
};

export { InvitationItem };
