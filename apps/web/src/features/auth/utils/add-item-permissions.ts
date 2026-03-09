import type { ResourcePermission } from "@/features/memberships/types";
import type { Maybe } from "@/types";
import type { IsOwner } from "../types";

type ItemPermission = Pick<ResourcePermission, "canUpdate" | "canDelete">;

/**
 * Combine ownership and organisation-level permissions into item-scoped access flags.
 *
 * This helper centralises the common pattern used across:
 * - `items-with-permissions.ts`
 * - `item-with-permissions.ts`
 * - `add-comments-access.ts`
 *
 * Semantics:
 * - Only item-scoped flags are applied here:
 *   - `isOwner` is per resource instance.
 *   - `canUpdate` / `canDelete` require both ownership and permission.
 * - Org-scoped `canCreate` should be derived from the `ResourcePermission`
 *   at a higher level (e.g. list/page context), not per item.
 *
 * @param item - The item to decorate with access flags
 * @param owns - Whether the current user owns this specific item
 * @param permission - Organisation-level permission for the resource type
 */
export const addItemPermissions = <T>(
  item: T,
  owns: boolean,
  permission: Maybe<ResourcePermission>,
): T & ItemPermission & IsOwner => ({
  ...item,
  isOwner: owns,
  canUpdate: owns && (permission?.canUpdate ?? false),
  canDelete: owns && (permission?.canDelete ?? false),
});
