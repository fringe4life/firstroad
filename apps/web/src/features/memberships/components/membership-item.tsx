import { format } from "date-fns";
import { LucideBan, LucideCheck } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import type { MembershipItemProps } from "../types";
import { MembershipActionButtons } from "./membership-action-buttons";
import { PermissionToggle } from "./permission-toggle";

const MembershipItem = ({
  currentUserEmail,
  member,
  organizationId,
}: MembershipItemProps) => {
  const isCurrentUser = member.email === currentUserEmail;
  const ticketPerms = member.permissions.TICKET;

  return (
    <TableRow>
      <TableCell>
        {member.name}
        {isCurrentUser && " (you)"}
      </TableCell>
      <TableCell>{member.email}</TableCell>
      <TableCell>{format(member.joinedAt, "dd/MM/yyyy, HH:mm")}</TableCell>
      <TableCell>
        {member.emailVerified ? <LucideCheck /> : <LucideBan />}
      </TableCell>
      <TableCell>
        <PermissionToggle
          action="canCreate"
          memberId={member.id}
          organizationId={organizationId}
          permissionValue={ticketPerms.canCreate}
          resourceType="TICKET"
        />
      </TableCell>
      <TableCell>
        <PermissionToggle
          action="canUpdate"
          memberId={member.id}
          organizationId={organizationId}
          permissionValue={ticketPerms.canUpdate}
          resourceType="TICKET"
        />
      </TableCell>
      <TableCell>
        <PermissionToggle
          action="canDelete"
          memberId={member.id}
          organizationId={organizationId}
          permissionValue={ticketPerms.canDelete}
          resourceType="TICKET"
        />
      </TableCell>
      <TableCell>
        <MembershipActionButtons
          currentUserEmail={currentUserEmail}
          memberEmail={member.email}
          memberId={member.id}
          organizationId={organizationId}
          role={member.role}
        />
      </TableCell>
    </TableRow>
  );
};

export { MembershipItem };
