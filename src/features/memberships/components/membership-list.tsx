import { Bug, CircleSlash2 } from "lucide-react";
import { TableBody } from "@/components/ui/table";
import { UnsuccessfulTable } from "@/components/unsuccessful-table";
import type { MembershipListProps } from "../types";
import { MembershipItem } from "./membership-item";

const MembershipList = ({
  currentUserEmail,
  members,
  emptyStateMessage,
  errorStateMessage = "Failed to fetch members",
  organisationId,
}: MembershipListProps) => {
  const isError = !members;
  const isEmpty = !isError && members.length === 0;
  const message = isError ? errorStateMessage : emptyStateMessage;
  const icon = isError ? <Bug /> : <CircleSlash2 />;

  if (isError || isEmpty) {
    return <UnsuccessfulTable colSpan={4} icon={icon} label={message} />;
  }

  return (
    <TableBody className="items-start">
      {members.map((member) => (
        <MembershipItem
          currentUserEmail={currentUserEmail}
          key={member.id}
          member={member}
          organisationId={organisationId}
        />
      ))}
    </TableBody>
  );
};

export { MembershipList };
