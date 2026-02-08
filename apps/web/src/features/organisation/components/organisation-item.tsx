import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import type { OrganisationItemProps } from "../types";
import { isAdminOrOwner } from "../utils/admin";
import { OrganisationActionButtons } from "./organisation-action-buttons";

const OrganisationItem = ({
  organisation,
  activeOrganizationId,
  limitedAccess,
}: OrganisationItemProps) => {
  const isActive = organisation.id === activeOrganizationId;
  const isAdminOrOwnerValue = isAdminOrOwner(
    organisation.memberShipByUser ?? { role: null },
  );

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
      <TableCell className="uppercase">
        {organisation.memberShipByUser?.role ?? "N/A"}
      </TableCell>
      <TableCell>
        <OrganisationActionButtons
          isActive={isActive}
          isAdminOrOwner={isAdminOrOwnerValue}
          limitedAccess={limitedAccess}
          organizationId={organisation.id}
          organizationName={organisation.name}
        />
      </TableCell>
    </TableRow>
  );
};

export { OrganisationItem };
