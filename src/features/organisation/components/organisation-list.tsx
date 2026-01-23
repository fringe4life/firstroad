import { Bug, CircleSlash2 } from "lucide-react";
import { TableBody } from "@/components/ui/table";
import { UnsuccessfulTable } from "@/components/unsuccessful-table";
import type { OrganisationListProps } from "../types";
import { OrganisationItem } from "./organisation-item";

const OrganisationList = ({
  organisations,
  activeOrganizationId,
  emptyStateMessage,
  errorStateMessage = "Failed to fetch organisations",
  limitedAccess,
}: OrganisationListProps) => {
  const isError = !organisations;
  const isEmpty = !isError && organisations.length === 0;
  const message = isError ? errorStateMessage : emptyStateMessage;
  const icon = isError ? <Bug /> : <CircleSlash2 />;

  if (isError || isEmpty) {
    return <UnsuccessfulTable colSpan={5} icon={icon} label={message} />;
  }

  return (
    <TableBody className="items-start">
      {organisations.map((organisation) => (
        <OrganisationItem
          activeOrganizationId={activeOrganizationId}
          key={organisation.id}
          limitedAccess={limitedAccess}
          organisation={organisation}
        />
      ))}
    </TableBody>
  );
};

export { OrganisationList };
