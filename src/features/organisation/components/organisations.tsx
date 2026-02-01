import { Table } from "@/components/ui/table";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { OrganisationList } from "@/features/organisation/components/organisation-list";
import { getOrganisationByUser } from "@/features/organisation/queries/get-organisations-for-user";
import type { OrganisationProps } from "../types";
import { OrganisationsTableHeader } from "./organisations-table-header";

const Organisations = async ({ limitedAccess }: OrganisationProps) => {
  const user = await getUserOrRedirect({ checkOrganistation: false });
  const organisations = await getOrganisationByUser();
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
