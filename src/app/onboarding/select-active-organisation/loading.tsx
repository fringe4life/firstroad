import { HeadingSkeleton } from "@/components/heading-skeleton";
import { OrganisationsSkeleton } from "@/features/organisation/components/organisations-skeleton";

const SelectActiveOrganisationLoading = () => (
  <>
    <HeadingSkeleton showActions />
    <OrganisationsSkeleton />
  </>
);

export default SelectActiveOrganisationLoading;
