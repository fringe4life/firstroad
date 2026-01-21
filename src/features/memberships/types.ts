import type { List, UnsuccessfulState } from "@/types";

export interface OrganisationMemberRow {
  name: string;
  email: string;
  emailVerified: boolean;
  joinedAt: Date;
}

export interface MembershipListProps extends UnsuccessfulState {
  members: List<OrganisationMemberRow>;
}

export interface MembershipItemProps {
  member: OrganisationMemberRow;
}

export interface OrganisationByIdProps {
  members: List<OrganisationMemberRow>;
}
