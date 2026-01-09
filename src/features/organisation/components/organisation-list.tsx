import { Bug, CircleSlash2 } from "lucide-react";
import { Placeholder } from "@/components/placeholder";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { ActiveOrganizationId } from "@/features/auth/types";
import type { List, UnsuccessfulState } from "@/types";
import type { BaseOrganisation } from "../types";
import { OrganisationItem } from "./organisation-item";

interface OrganisationListProps
  extends UnsuccessfulState,
    ActiveOrganizationId {
  organisations: List<BaseOrganisation>;
}

const OrganisationList = ({
  organisations,
  activeOrganizationId,
  emptyStateMessage,
  errorStateMessage = "Failed to fetch organisations",
}: OrganisationListProps) => {
  const isError = !organisations;
  const isEmpty = !isError && organisations.length === 0;
  const message = isError ? errorStateMessage : emptyStateMessage;
  const icon = isError ? <Bug /> : <CircleSlash2 />;

  if (isError || isEmpty) {
    return (
      <TableBody className="h-full">
        <TableRow>
          <TableCell colSpan={5}>
            <Placeholder icon={icon} label={message} />
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {organisations.map((organisation) => (
        <OrganisationItem
          activeOrganizationId={activeOrganizationId}
          key={organisation.id}
          organisation={organisation}
        />
      ))}
    </TableBody>
  );
};

export { OrganisationList };
