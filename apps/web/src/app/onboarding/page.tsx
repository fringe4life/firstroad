import { CardCompact } from "@/components/card-compact";
import { Suspend } from "@/components/suspend";
import { createOrganisation } from "@/features/organisation/actions/create-organisation";
import { CreateOrganisationForm } from "@/features/organisation/components/create-organisation-form";
import { CreateOrganisationSkeletonForm } from "@/features/organisation/components/skeletons/create-organisation-skeleton-form";

const OnboardingPage = () => (
  <div className="grid h-full w-full place-content-center">
    <CardCompact
      className="max-content-narrow place-self-center"
      content={
        <Suspend fallback={<CreateOrganisationSkeletonForm />}>
          <CreateOrganisationForm
            createOrganisationAction={createOrganisation}
          />
        </Suspend>
      }
      description="Create an organisation to get started"
      title="Create Organisation"
    />
  </div>
);

export default OnboardingPage;
