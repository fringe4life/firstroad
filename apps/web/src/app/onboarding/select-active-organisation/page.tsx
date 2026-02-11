import { LucidePlus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Heading } from "@/components/heading";
import { ResponsiveLabel } from "@/components/responsive-label";
import { Suspend } from "@/components/suspend";
import { buttonVariants } from "@/components/ui/button";
import { getUser } from "@/features/auth/queries/get-user";
import { Organisations } from "@/features/organisation/components/organisations";
import { OrganisationsSkeleton } from "@/features/organisation/components/skeletons/organisations-skeleton";
import { onboardingPath, organisationsPath, signInPath } from "@/path";

const SelectActiveOrganisationPage = async () => {
  await connection();
  const { user, hasUser } = await getUser();

  if (!hasUser) {
    throw redirect(signInPath());
  }

  if (user.activeOrganizationId) {
    throw redirect(organisationsPath());
  }
  return (
    <>
      <Heading
        actions={
          <ResponsiveLabel
            fullLabel="Create Organisation"
            icon={<LucidePlus className="aspect-square w-4" />}
            shortLabel="Create"
          >
            <Link className={buttonVariants()} href={onboardingPath()} />
          </ResponsiveLabel>
        }
        description="Select your active organisation"
        title="Select Active Organisation"
      />
      <Suspend fallback={<OrganisationsSkeleton />}>
        <Organisations limitedAccess user={user} />
      </Suspend>
    </>
  );
};

export default SelectActiveOrganisationPage;
