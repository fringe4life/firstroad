import type { MemberModel, MemberRole } from "@firstroad/db/client-types";

import type { List, UnsuccessfulState } from "@/types";
import type { User, UserVerifiable } from "../auth/types";
import type { OrganisationId } from "../organisation/types";

export type ResourceType = "TICKET" | "COMMENT";

export type PermissionAction = "canCreate" | "canUpdate" | "canDelete";

export interface ResourcePermission {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface OrgScopedResource extends UserVerifiable {
  organizationId: string;
}

export interface WithPermissions {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface PermissionKey {
  resourceType: ResourceType;
  action: PermissionAction;
}

export interface OrganisationMemberRow
  extends Omit<MemberModel, "createdAt" | "organizationId" | "userId">,
    Pick<User, "name" | "email" | "emailVerified"> {
  joinedAt: Date;
  permissions: Record<ResourceType, ResourcePermission>;
}

export interface MemberId {
  memberId: string;
}

export interface MembershipListProps extends UnsuccessfulState, OrganisationId {
  currentUserEmail?: string | null;
  members: List<OrganisationMemberRow>;
}

export interface MembershipItemProps extends OrganisationId {
  currentUserEmail?: string | null;
  member: OrganisationMemberRow;
}

export interface OrganisationByIdProps {
  members: List<OrganisationMemberRow>;
}

export interface MembershipsMoreMenuProps extends OrganisationId, MemberId {
  role: MemberRole;
}

export interface PermissionToggleProps extends OrganisationId, MemberId {
  resourceType: ResourceType;
  action: PermissionAction;
  permissionValue: boolean;
}

export interface MemberShipProps extends OrganisationId {}
