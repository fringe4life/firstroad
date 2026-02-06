import { Heading } from "@/components/heading";
import { ActionsSkeleton } from "@/components/skeletons/actions-skeleton";
import { OrganisationsSkeleton } from "@/features/organisation/components/organisations-skeleton";

const SelectActiveOrganisationLoading = () => (
  <>
    <Heading
      actions={<ActionsSkeleton />}
      description="Select your active organisation"
      title="Select Active Organisation"
    />
    <OrganisationsSkeleton />
  </>
);

export default SelectActiveOrganisationLoading;
