import type { IsOwner, User } from "@/features/auth/types";
import { addItemPermissions } from "@/features/auth/utils/add-item-permissions";
import { isOwner } from "@/features/auth/utils/owner";
import type { CommentWithUserInfo } from "@/features/comment/types";
import { DEFAULT_ITEM_PERMISSION } from "@/features/memberships/constants";
import { getMemberPermissionsBatch } from "@/features/memberships/queries/get-member-permissions-batch";
import type {
  ResourcePermission,
  ResourceType,
} from "@/features/memberships/types";
import type { List, Maybe } from "@/types";
import { DEFAULT_OWNERSHIP } from "../constants";

export type CommentWithAccess = CommentWithUserInfo &
  IsOwner &
  Pick<ResourcePermission, "canUpdate" | "canDelete">;

/**
 * Add ownership and permission access to a list of comments.
 * All comments on a ticket share the same organizationId (from the ticket).
 *
 * @param list - List of comments
 * @param user - Current user (or null if not authenticated)
 * @param organizationId - Organization ID from the ticket (all comments share this)
 * @returns List of comments with isOwner, canUpdate, and canDelete properties
 */
const addCommentsAccess = async (
  list: List<CommentWithUserInfo>,
  user: Maybe<User>,
  organizationId: string,
): Promise<List<CommentWithAccess>> => {
  if (!list) {
    return null;
  }
  if (list.length === 0) {
    return [];
  }

  if (!user) {
    return list.map((comment) => ({
      ...comment,
      ...DEFAULT_OWNERSHIP,
      ...DEFAULT_ITEM_PERMISSION,
    }));
  }

  const permissionsMap = await getMemberPermissionsBatch(
    user.id,
    [organizationId],
    "COMMENT" satisfies ResourceType,
  );
  const permission = permissionsMap.get(organizationId);

  return list.map((comment) =>
    addItemPermissions(comment, isOwner(user, comment), permission),
  );
};

export { addCommentsAccess };
