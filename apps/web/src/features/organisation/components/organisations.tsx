import { Table } from "@/components/ui/table";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { OrganisationList } from "@/features/organisation/components/organisation-list";
import { getOrganisationByUser } from "@/features/organisation/queries/get-organisations-for-user";
import type { OrganisationProps } from "../types";
import { OrganisationsTableHeader } from "./organisations-table-header";

const Organisations = async ({
  limitedAccess,
  organisations: prefetchedOrganisations,
}: OrganisationProps) => {
  const user = await getUserOrRedirect({
    checkActiveOrganisation: !limitedAccess,
    checkOrganistation: false,
  });
  const organisations =
    prefetchedOrganisations ?? (await getOrganisationByUser(user.id));
  const activeOrganizationId = user.activeOrganizationId;

  return (
    <Table>
      <OrganisationsTableHeader />
      <OrganisationList
        activeOrganizationId={activeOrganizationId}
        emptyStateMessage="No organisations found"
        errorStateMessage="Failed to fetch organisations"
        limitedAccess={limitedAccess}
        organisations={organisations}
      />
    </Table>
  );
};

export { Organisations };
