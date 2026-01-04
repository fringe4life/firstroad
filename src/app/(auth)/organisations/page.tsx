import { Heading } from "@/components/heading";
import { OrganisationList } from "@/features/organisation/components/organisation-list";

const OrganisationsPage = () => {
  return (
    <>
      <Heading description="All your Organisations" title="Organisations" />
      <OrganisationList />
    </>
  );
};

export default OrganisationsPage;
