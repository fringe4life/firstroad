import { Heading } from "@/components/heading";
import { ActionsSkeleton } from "@/components/skeletons/actions-skeleton";
import { OrganisationsSkeleton } from "@/features/organisation/components/skeletons/organisations-skeleton";

const OrganisationsLoading = () => (
  <div className="grid h-full grid-rows-[min-content_min-content_1fr] gap-y-8">
    <Heading
      actions={<ActionsSkeleton />}
      description="All your Organisations"
      title="Organisations"
    />
    <OrganisationsSkeleton />
  </div>
);

export default OrganisationsLoading;
