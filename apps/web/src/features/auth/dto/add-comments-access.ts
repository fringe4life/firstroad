import type { IsOwner, User } from "@/features/auth/types";
import { isOwner } from "@/features/auth/utils/owner";
import type { CommentWithUserInfo } from "@/features/comment/types";
import { getMemberPermissionsBatch } from "@/features/memberships/queries/get-member-permissions-batch";
import type {
  ResourceType,
  WithPermissions,
} from "@/features/memberships/types";
import type { List, Maybe } from "@/types";

export type CommentWithAccess = CommentWithUserInfo & WithPermissions & IsOwner;

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
      isOwner: false,
      canCreate: false,
      canUpdate: false,
      canDelete: false,
    }));
  }

  const permissionsMap = await getMemberPermissionsBatch(
    user.id,
    [organizationId],
    "COMMENT" satisfies ResourceType,
  );
  const permission = permissionsMap.get(organizationId);

  return list.map((comment) => {
    const owns = isOwner(user, comment);
    return {
      ...comment,
      isOwner: owns,
      canCreate: false,
      canUpdate: owns && (permission?.canUpdate ?? false),
      canDelete: owns && (permission?.canDelete ?? false),
    };
  });
};

export { addCommentsAccess };
