import { CardCompact } from "@/components/card-compact";
import { createOrganisation } from "@/features/organisation/actions/create-organisation";
import { CreateOrganisationForm } from "@/features/organisation/components/create-organisation-form";

const CreateOrganisationsPage = () => (
  <div className="grid h-full w-full place-content-center">
    <CardCompact
      className="max-content-narrow"
      content={
        <CreateOrganisationForm createOrganisationAction={createOrganisation} />
      }
      description="Create an organisation for your team"
      title="Create Organisation"
    />
  </div>
);

export default CreateOrganisationsPage;
