import { getMemberPermission } from "@/features/memberships/queries/get-member-permission";
import type {
  OrgScopedResource,
  ResourceType,
  WithPermissions,
} from "@/features/memberships/types";
import type { Maybe } from "@/types";
import { getUser } from "../queries/get-user";
import type { User } from "../types";
import { isOwner } from "../utils/owner";

/**
 * DAL helper for adding permission information to a single item.
 * Fetches permission, computes canUpdate, canDelete from isOwner && permission.
 * canCreate not applicable for existing items; set to false.
 *
 * @param item - The item or a promise of the item
 * @param user - The user to check permissions against
 * @param resourceType - The resource type for permission lookup
 * @returns The item with canUpdate, canDelete (canCreate: false for existing items)
 */
const itemWithPermissions = async <T extends OrgScopedResource>(
  item: Maybe<T> | Promise<Maybe<T>>,
  user: Maybe<User>,
  resourceType: ResourceType,
): Promise<Maybe<T & WithPermissions>> => {
  const [currentUser, resolvedItem] = await Promise.all([
    user != null ? Promise.resolve(user) : getUser().then(({ user: u }) => u),
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

  return {
    ...resolvedItem,
    canCreate: false,
    canUpdate: owns && (permission?.canUpdate ?? false),
    canDelete: owns && (permission?.canDelete ?? false),
  };
};

export { itemWithPermissions };
