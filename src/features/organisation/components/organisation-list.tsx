import GenericComponent from "@/components/generic-component";
import { getOrganisationByUser } from "../queries/get-organisations-for-user";
import OrganisationItem from "./organisation-item";

const OrganisationList = async () => {
  const organisations = await getOrganisationByUser();
  return (
    <GenericComponent
      Component={OrganisationItem}
      className="grid gap-y-4"
      emptyStateMessage="No Organisations Found"
      items={organisations}
      renderKey={(organisation) => organisation.id}
      renderProps={(organisation) => ({ organisation })}
    />
  );
};

export default OrganisationList;
