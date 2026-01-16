import { LucidePlus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Heading } from "@/components/heading";
import { Spinner } from "@/components/spinner";
import { Suspend } from "@/components/suspend";
import { buttonVariants } from "@/components/ui/button";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { Organisations } from "@/features/organisation/components/organisations";
import { onboardingPath, organisationsPath } from "@/path";

const SelectActiveOrganisationPage = async () => {
  await connection();
  const user = await getUserOrRedirect();

  if (user.activeOrganizationId) {
    throw redirect(organisationsPath());
  }
  return (
    <div className="grid h-full grid-rows-[min-content_min-content_1fr] gap-y-8">
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
    </div>
  );
};

export default SelectActiveOrganisationPage;
