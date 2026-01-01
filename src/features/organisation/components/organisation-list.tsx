import { GenericComponent } from "@/components/generic-component";
import { OrganisationItem } from "@/features/organisation/components/organisation-item";
import { getOrganisationByUser } from "@/features/organisation/queries/get-organisations-for-user";

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

export { OrganisationList };
