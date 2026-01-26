import type { AdminVerifiable } from "../types";

/**
 * Checks if a role-based entity has admin or owner permissions
 *
 * @param entity - An object with a role property (from Prisma or Better Auth)
 * @returns boolean indicating if the role is "admin" or "owner"
 *
 * @example
 * const isAdmin = isAdminOrOwner({ role: "admin" });
 * const isOwner = isAdminOrOwner({ role: "owner" });
 * const canManage = isAdminOrOwner(organisation.memberShipByUser);
 */
const isAdminOrOwner = <T extends AdminVerifiable>({ role }: T): boolean =>
  role === "admin" || role === "owner";

export { isAdminOrOwner };
