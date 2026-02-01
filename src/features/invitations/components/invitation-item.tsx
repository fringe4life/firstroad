import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import type { InvitationItemProps } from "../types";

const InvitationItem = ({ invitation }: InvitationItemProps) => {
  return (
    <TableRow>
      <TableCell>{invitation.email}</TableCell>
      <TableCell>{format(invitation.invitedAt, "dd/MM/yyyy, HH:mm")}</TableCell>
      <TableCell>{invitation.inviterName ?? "Unknown"}</TableCell>
    </TableRow>
  );
};

export { InvitationItem };
