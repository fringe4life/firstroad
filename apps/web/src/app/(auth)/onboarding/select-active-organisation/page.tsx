import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspend } from "@/components/suspend";
import { getUser } from "@/features/auth/queries/get-user";
import { Organisations } from "@/features/organisation/components/organisations";
import { SelectActiveOrganisationHeading } from "@/features/organisation/components/select-active-organisation-heading";
import { OrganisationsSkeleton } from "@/features/organisation/components/skeletons/organisations-skeleton";
import { organisationsPath, signInPath } from "@/path";

const SelectActiveOrganisationPage = async () => {
  await connection();
  const { user, hasUser } = await getUser();

  if (!hasUser) {
    redirect(signInPath());
  }

  if (user.activeOrganizationId) {
    redirect(organisationsPath());
  }
  return (
    <>
      <SelectActiveOrganisationHeading />
      <Suspend fallback={<OrganisationsSkeleton />}>
        <Organisations limitedAccess />
      </Suspend>
    </>
  );
};

export default SelectActiveOrganisationPage;
