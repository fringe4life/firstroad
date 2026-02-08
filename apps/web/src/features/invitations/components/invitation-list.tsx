import { Bug, CircleSlash2 } from "lucide-react";
import { TableBody } from "@/components/ui/table";
import { UnsuccessfulTable } from "@/components/unsuccessful-table";
import type { InvitationListProps } from "../types";
import { InvitationItem } from "./invitation-item";

const InvitationList = ({
  invitations,
  organizationId,
  emptyStateMessage,
  errorStateMessage = "Failed to fetch invitations",
}: InvitationListProps) => {
  const isError = !invitations;
  const isEmpty = !isError && invitations.length === 0;
  const message = isError ? errorStateMessage : emptyStateMessage;
  const icon = isError ? <Bug /> : <CircleSlash2 />;

  if (isError || isEmpty) {
    return <UnsuccessfulTable colSpan={4} icon={icon} label={message} />;
  }

  return (
    <TableBody className="items-start">
      {invitations.map((invitation) => (
        <InvitationItem
          invitation={invitation}
          key={invitation.id}
          organizationId={organizationId}
        />
      ))}
    </TableBody>
  );
};

export { InvitationList };
