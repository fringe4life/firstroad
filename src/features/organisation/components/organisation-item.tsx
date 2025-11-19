import { format } from "date-fns";
import type { getOrganisationByUser } from "../queries/get-organisations-for-user";

const OrganisationItem = ({
  organisation,
}: {
  organisation: Awaited<ReturnType<typeof getOrganisationByUser>>[number];
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
