import { format } from "date-fns";
import { LucideBan, LucideCheck } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import type { MembershipItemProps } from "../types";
import { MembershipActionButtons } from "./membership-action-buttons";

const MembershipItem = ({
  currentUserEmail,
  member,
  organisationId,
}: MembershipItemProps) => {
  const isCurrentUser = member.email === currentUserEmail;

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
        <MembershipActionButtons
          currentUserEmail={currentUserEmail}
          memberEmail={member.email}
          memberId={member.id}
          organisationId={organisationId}
          role={member.role}
        />
      </TableCell>
    </TableRow>
  );
};

export { MembershipItem };
