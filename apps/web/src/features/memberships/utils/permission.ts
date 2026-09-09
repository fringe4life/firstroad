import type { User } from "@/features/auth/types";
import { isOwner } from "@/features/auth/utils/owner";
import type { Maybe } from "@/types";
import { getMemberPermission } from "../queries/get-member-permission";
import type {
  OrgScopedResource,
  ResourcePermission,
  ResourceType,
} from "../types";

/**
 * Check if user can delete a resource (async - requires DB lookup).
 * Rule: isOwner(resource, user) && permission.canDelete
 */
const canDelete = async <T extends OrgScopedResource>(
  user: Maybe<User>,
  resource: T,
  resourceType: ResourceType,
): Promise<boolean> => {
  if (!user) {
    return false;
  }
  const permission = await getMemberPermission(
    user.id,
    resource.organizationId,
    resourceType,
  );
  return canDeleteWithPermission(isOwner(user, resource), permission);
};

/**
 * Check if user can update a resource (async - requires DB lookup).
 * Rule: isOwner(resource, user) && permission.canUpdate
 */
const canUpdate = async <T extends OrgScopedResource>(
  user: Maybe<User>,
  resource: T,
  resourceType: ResourceType,
): Promise<boolean> => {
  if (!user) {
    return false;
  }
  const permission = await getMemberPermission(
    user.id,
    resource.organizationId,
    resourceType,
  );
  return canUpdateWithPermission(isOwner(user, resource), permission);
};

/**
 * Check if user can create a resource in an organization (async - requires DB lookup).
 */
const canCreate = async (
  user: Maybe<User>,
  organizationId: string,
  resourceType: ResourceType,
): Promise<boolean> => {
  if (!user) {
    return false;
  }
  const permission = await getMemberPermission(
    user.id,
    organizationId,
    resourceType,
  );
  return permission?.canCreate ?? false;
};

/**
 * Sync check for delete when permission is pre-fetched.
 */
const canDeleteWithPermission = (
  owner: boolean,
  permission: Maybe<ResourcePermission>,
): boolean => Boolean(owner && permission?.canDelete);

/**
 * Sync check for update when permission is pre-fetched.
 */
const canUpdateWithPermission = (
  owner: boolean,
  permission: Maybe<ResourcePermission>,
): boolean => Boolean(owner && permission?.canUpdate);

export {
  canCreate,
  canDelete,
  canDeleteWithPermission,
  canUpdate,
  canUpdateWithPermission,
};
