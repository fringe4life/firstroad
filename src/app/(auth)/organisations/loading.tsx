import { HeadingSkeleton } from "@/components/heading-skeleton";
import { OrganisationsSkeleton } from "@/features/organisation/components/organisations-skeleton";

const OrganisationsLoading = () => (
  <div className="grid h-full grid-rows-[min-content_min-content_1fr] gap-y-8">
    <HeadingSkeleton showActions />
    <OrganisationsSkeleton />
  </div>
);

export default OrganisationsLoading;
