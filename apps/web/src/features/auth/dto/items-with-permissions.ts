import { DEFAULT_PERMISSION } from "@/features/memberships/constants";
import { getMemberPermissionsBatch } from "@/features/memberships/queries/get-member-permissions-batch";
import type {
  OrgScopedResource,
  ResourceType,
  WithPermissions,
} from "@/features/memberships/types";
import type { List, Maybe } from "@/types";
import type { IsOwner, ItemsWithPermissionsOptions, User } from "../types";
import { isOwner } from "../utils/owner";

/**
 * DAL helper for adding permission information to a list of items.
 * Uses batch permission fetch when no permissionsMap provided.
 *
 * @param items - List of items or a promise of the list
 * @param user - The user to check permissions against
 * @param resourceType - The resource type for permission lookup
 * @param options - Optional pre-fetched permissionsMap for optimization
 * @returns List of items with canUpdate, canDelete (canCreate: false for existing items)
 */
const itemsWithPermissions = async <T extends OrgScopedResource>(
  items: List<T> | Promise<List<T>>,
  user: Maybe<User>,
  resourceType: ResourceType,
  options?: ItemsWithPermissionsOptions,
): Promise<List<T & WithPermissions & IsOwner>> => {
  const resolvedItems = await items;

  // dont do any async work if no items
  if (!resolvedItems) {
    return null;
  }

  // dont do any async work if list is empty
  if (resolvedItems.length === 0) {
    return [];
  }

  // if no user they have no permissions or ownership
  if (!user) {
    return resolvedItems.map((item) => ({
      ...item,
      ...DEFAULT_PERMISSION,
      isOwner: false,
    }));
  }

  let permissionsMap = options?.permissionsMap;

  // if permissions arent passed in calculate unique ids
  // to avoid sending/receiving larger request to database
  if (!permissionsMap) {
    const organizationIds = [
      ...new Set(resolvedItems.map((i) => i.organizationId)),
    ];
    permissionsMap = await getMemberPermissionsBatch(
      user.id,
      organizationIds,
      resourceType,
    );
  }

  // finally add permissions to each item and return
  return resolvedItems.map((item) => {
    const owns = isOwner(user, item);
    const permission = permissionsMap.get(item.organizationId);

    return {
      ...item,
      isOwner: owns,
      canCreate: owns && (permission?.canCreate ?? false),
      canUpdate: owns && (permission?.canUpdate ?? false),
      canDelete: owns && (permission?.canDelete ?? false),
    };
  });
};

export { itemsWithPermissions };
