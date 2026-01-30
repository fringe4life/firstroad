import type { MemberRole } from "@/generated/prisma/enums";
import type { MemberModel, UserModel } from "@/generated/prisma/models";
import type { List, UnsuccessfulState } from "@/types";
import type { OrganisationId } from "../organisation/types";

export interface OrganisationMemberRow
  extends Omit<MemberModel, "createdAt" | "organizationId" | "userId">,
    Pick<UserModel, "name" | "email" | "emailVerified"> {
  joinedAt: Date;
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

export interface MembershipsMoreMenuProps extends OrganisationId {
  memberId: string;
  role: MemberRole;
}

export type PermissionKey = "canDeleteTicket";

export interface PermissionToggleProps extends OrganisationId {
  memberId: string;
  permissionKey: PermissionKey;
  permissionValue: boolean;
}
