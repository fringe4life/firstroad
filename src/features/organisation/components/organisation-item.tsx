import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import type { OrganisationItemProps } from "../types";
import { OrganisationActionButtons } from "./organisation-action-buttons";

const OrganisationItem = ({
  organisation,
  activeOrganizationId,
  limitedAccess,
}: OrganisationItemProps) => {
  const isActive = organisation.id === activeOrganizationId;

  return (
    <TableRow className={isActive ? "bg-muted" : ""} data-active={isActive}>
      <TableCell>{organisation.id}</TableCell>
      <TableCell>{organisation.name}</TableCell>
      <TableCell>
        {organisation.memberShipByUser?.createdAt
          ? format(organisation.memberShipByUser.createdAt, "dd/MM/yyyy, HH:mm")
          : "N/A"}
      </TableCell>
      <TableCell>{organisation._count.members}</TableCell>
      <TableCell>
        <OrganisationActionButtons
          isActive={isActive}
          limitedAccess={limitedAccess}
          organizationId={organisation.id}
        />
      </TableCell>
    </TableRow>
  );
};

export { OrganisationItem };
