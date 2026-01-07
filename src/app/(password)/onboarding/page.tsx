import { CardCompact } from "@/components/card-compact";
import { createOrganisation } from "@/features/organisation/actions/create-organisation";
import { CreateOrganisationForm } from "@/features/organisation/components/create-organisation-form";

const OnboardingPage = () => {
  return (
    <CardCompact
      content={
        <CreateOrganisationForm createOrganisationAction={createOrganisation} />
      }
      description="Create an organisation to get started"
      title="Create Organisation"
    />
  );
};

export default OnboardingPage;
