import type { List, UnsuccessfulState } from "@/types";

export interface OrganisationMemberRow {
  name: string;
  email: string;
  emailVerified: boolean;
  joinedAt: Date;
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
