import { connection } from "next/server";
import { Suspend } from "@/components/suspend";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { Organisations } from "@/features/organisation/components/organisations";
import { OrganisationsHeading } from "@/features/organisation/components/organisations-heading";
import { OrganisationsSkeleton } from "@/features/organisation/components/skeletons/organisations-skeleton";

const OrganisationsPage = async () => {
  await connection();
  await getUserOrRedirect();
  return (
    <div className="grid h-full grid-rows-[min-content_min-content_1fr] gap-y-8">
      <OrganisationsHeading />
      <Suspend fallback={<OrganisationsSkeleton />}>
        <Organisations />
      </Suspend>
    </div>
  );
};

export default OrganisationsPage;
