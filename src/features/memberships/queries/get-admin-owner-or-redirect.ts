import { redirect } from "next/navigation";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { organisationsPath } from "@/path";
import { getMemberRole } from "./get-member-role";

const getAdminOwnerOrRedirect = async (organizationId: string) => {
  await getUserOrRedirect();
  const role = await getMemberRole(organizationId);

  if (!role || (role !== "admin" && role !== "owner")) {
    // Redirect if user doesn't have membership or is not admin/owner
    redirect(organisationsPath());
  }

  return role;
};

export { getAdminOwnerOrRedirect };
