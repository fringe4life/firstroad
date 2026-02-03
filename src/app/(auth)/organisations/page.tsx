import { LucidePlus } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import { Heading } from "@/components/heading";
import { Suspend } from "@/components/suspend";
import { buttonVariants } from "@/components/ui/button";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { Organisations } from "@/features/organisation/components/organisations";
import { OrganisationsSkeleton } from "@/features/organisation/components/organisations-skeleton";
import { onboardingPath } from "@/path";

const OrganisationsPage = async () => {
  await connection();
  await getUserOrRedirect({ checkOrganistation: false });
  return (
    <div className="grid h-full grid-rows-[min-content_min-content_1fr] gap-y-8">
      <Heading
        actions={
          <Link className={buttonVariants()} href={onboardingPath()}>
            <LucidePlus className="aspect-square w-4" />
            Create Organisation
          </Link>
        }
        description="All your Organisations"
        title="Organisations"
      />
      <Suspend fallback={<OrganisationsSkeleton />}>
        <Organisations />
      </Suspend>
    </div>
  );
};

export default OrganisationsPage;
