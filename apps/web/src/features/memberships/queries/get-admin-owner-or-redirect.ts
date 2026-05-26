import type { MemberModel } from "@firstroad/db/client-types";
import { redirect } from "next/navigation";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import type { User } from "@/features/auth/types";
import { organisationsPath } from "@/path";
import { getMemberRole } from "./get-member-role";

type AdminOwnerRole = Extract<MemberModel["role"], "admin" | "owner">;

interface AdminOwnerContext {
  role: AdminOwnerRole;
  user: User;
}

const getAdminOwnerOrRedirect = async (
  organizationId: string,
): Promise<AdminOwnerContext> => {
  const user = await getUserOrRedirect();
  const role = await getMemberRole(organizationId, user.id);

  if (!role || (role !== "admin" && role !== "owner")) {
    // Redirect if user doesn't have membership or is not admin/owner
    redirect(organisationsPath());
  }

  return { user, role };
};

export { getAdminOwnerOrRedirect };
