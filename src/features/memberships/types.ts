import type { MemberRole } from "@/generated/prisma/enums";
import type { List, UnsuccessfulState } from "@/types";

export interface OrganisationMemberRow {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  joinedAt: Date;
  role: MemberRole;
}

export interface MembershipListProps extends UnsuccessfulState {
  currentUserEmail?: string | null;
  members: List<OrganisationMemberRow>;
  organisationId: string;
}

export interface MembershipItemProps {
  currentUserEmail?: string | null;
  member: OrganisationMemberRow;
  organisationId: string;
}

export interface OrganisationByIdProps {
  members: List<OrganisationMemberRow>;
}

export interface MembershipsMoreMenuProps {
  organisationId: string;
  memberId: string;
  role: MemberRole;
}
