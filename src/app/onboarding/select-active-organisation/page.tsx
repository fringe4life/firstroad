import { LucidePlus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Heading } from "@/components/heading";
import { Spinner } from "@/components/spinner";
import { Suspend } from "@/components/suspend";
import { buttonVariants } from "@/components/ui/button";
import { getUser } from "@/features/auth/queries/get-user";
import { Organisations } from "@/features/organisation/components/organisations";
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
          <Link className={buttonVariants()} href={onboardingPath()}>
            <LucidePlus className="aspect-square w-4" />
            Create Organisation
          </Link>
        }
        description="Select your active organisation"
        title="Select Active Organisation"
      />
      <Suspend fallback={<Spinner />}>
        <Organisations limitedAccess />
      </Suspend>
    </>
  );
};

export default SelectActiveOrganisationPage;
