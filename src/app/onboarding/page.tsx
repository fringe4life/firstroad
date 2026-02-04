import { CardCompact } from "@/components/card-compact";
import { Spinner } from "@/components/spinner";
import { Suspend } from "@/components/suspend";
import { createOrganisation } from "@/features/organisation/actions/create-organisation";
import { CreateOrganisationForm } from "@/features/organisation/components/create-organisation-form";

const OnboardingPage = () => (
  <CardCompact
    content={
      <Suspend fallback={<Spinner />}>
        <CreateOrganisationForm createOrganisationAction={createOrganisation} />
      </Suspend>
    }
    description="Create an organisation to get started"
    title="Create Organisation"
  />
);

export default OnboardingPage;
