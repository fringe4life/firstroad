import { format } from "date-fns";
import type { BaseOrganisation } from "../types";

const OrganisationItem = ({
  organisation,
}: {
  organisation: BaseOrganisation;
}) => (
  <div>
    <h1>{organisation.name}</h1>
    <p>
      {format(organisation.memberShipByUser?.createdAt, "dd/MM/yyyy, HH:mm")}
    </p>
    <p>Members: {organisation._count.members}</p>
  </div>
);

export default OrganisationItem;
