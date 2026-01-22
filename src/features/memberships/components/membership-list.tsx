import { Bug, CircleSlash2 } from "lucide-react";
import { Placeholder } from "@/components/placeholder";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
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
    return (
      <TableBody className="h-full">
        <TableRow>
          <TableCell colSpan={4}>
            <Placeholder icon={icon} label={message} />
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody className="items-start">
      {members.map((member) => (
        <MembershipItem
          currentUserEmail={currentUserEmail}
          key={member.email}
          member={member}
          organisationId={organisationId}
        />
      ))}
    </TableBody>
  );
};

export { MembershipList };
