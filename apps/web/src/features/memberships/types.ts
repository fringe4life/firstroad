import type { MemberModel, MemberRole } from "@firstroad/db/client-types";

import type { List, UnsuccessfulState } from "@/types";
import type { User } from "../auth/types";
import type { OrganisationId } from "../organisation/types";
import type { CanDeleteTicket, CanUpdateTicket } from "../ticket/types";

export interface OrganisationMemberRow
  extends Omit<MemberModel, "createdAt" | "organizationId" | "userId">,
    Pick<User, "name" | "email" | "emailVerified"> {
  joinedAt: Date;
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

export type PermissionKey = "canDeleteTicket" | "canUpdateTicket";

export interface PermissionToggleProps extends OrganisationId, MemberId {
  permissionKey: PermissionKey;
  permissionValue: boolean;
}

export interface MemberShipProps extends OrganisationId {}

export interface MemberPermission extends CanDeleteTicket, CanUpdateTicket {}
