import { getMemberPermission } from "@/features/memberships/queries/get-member-permission";
import type {
  OrgScopedResource,
  ResourcePermission,
  ResourceType,
} from "@/features/memberships/types";
import type { Maybe } from "@/types";
import { getUser } from "../queries/get-user";
import type { IsOwner, User } from "../types";
import { addItemPermissions } from "../utils/add-item-permissions";
import { isOwner } from "../utils/owner";

/**
 * DAL helper for adding permission information to a single item.
 * Fetches permission, computes canUpdate, canDelete from isOwner && permission.
 * canCreate is org-scoped and should be derived from the permission at a higher
 * level when needed.
 *
 * @param item - The item or a promise of the item
 * @param user - The user to check permissions against
 * @param resourceType - The resource type for permission lookup
 * @returns The item with item-scoped access flags (isOwner, canUpdate, canDelete)
 */
const itemWithPermissions = async <T extends OrgScopedResource>(
  item: Maybe<T> | Promise<Maybe<T>>,
  user: Maybe<User>,
  resourceType: ResourceType,
): Promise<
  Maybe<T & Pick<ResourcePermission, "canUpdate" | "canDelete"> & IsOwner>
> => {
  const [currentUser, resolvedItem] = await Promise.all([
    user == null ? getUser().then(({ user: u }) => u) : Promise.resolve(user),
    Promise.resolve(item),
  ]);

  if (!(resolvedItem && currentUser)) {
    return null;
  }

  const permission = await getMemberPermission(
    currentUser.id,
    resolvedItem.organizationId,
    resourceType,
  );

  const owns = isOwner(currentUser, resolvedItem);

  return addItemPermissions(resolvedItem, owns, permission);
};

export { itemWithPermissions };
