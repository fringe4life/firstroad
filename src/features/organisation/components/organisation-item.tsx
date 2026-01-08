import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import type { BaseOrganisation } from "../types";
import { OrganisationActionButtons } from "./organisation-action-buttons";

const OrganisationItem = ({
  organisation,
}: {
  organisation: BaseOrganisation;
}) => (
  <TableRow>
    <TableCell>{organisation.id}</TableCell>
    <TableCell>{organisation.name}</TableCell>
    <TableCell>
      {organisation.memberShipByUser?.createdAt
        ? format(organisation.memberShipByUser.createdAt, "dd/MM/yyyy, HH:mm")
        : "N/A"}
    </TableCell>
    <TableCell>{organisation._count.members}</TableCell>
    <TableCell>
      <OrganisationActionButtons />
    </TableCell>
  </TableRow>
);

export { OrganisationItem };
