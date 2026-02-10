import { LucidePlus } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import { Heading } from "@/components/heading";
import { ResponsiveLabel } from "@/components/responsive-label";
import { Suspend } from "@/components/suspend";
import { buttonVariants } from "@/components/ui/button";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { Organisations } from "@/features/organisation/components/organisations";
import { OrganisationsSkeleton } from "@/features/organisation/components/skeletons/organisations-skeleton";
import { organisationsCreatePath } from "@/path";

const OrganisationsPage = async () => {
  await connection();
  const user = await getUserOrRedirect({ checkOrganistation: false });
  return (
    <div className="grid h-full grid-rows-[min-content_min-content_1fr] gap-y-8">
      <Heading
        actions={
          <ResponsiveLabel
            fullLabel="Create Organisation"
            icon={<LucidePlus className="aspect-square w-4" />}
            shortLabel="Create"
          >
            <Link
              className={buttonVariants()}
              href={organisationsCreatePath()}
            />
          </ResponsiveLabel>
        }
        description="All your Organisations"
        title="Organisations"
      />
      <Suspend fallback={<OrganisationsSkeleton />}>
        <Organisations user={user} />
      </Suspend>
    </div>
  );
};

export default OrganisationsPage;
