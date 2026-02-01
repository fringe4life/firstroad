import type { MemberRole } from "@/generated/prisma/enums";
import type { List, UnsuccessfulState } from "@/types";
import type { OrganisationId } from "../organisation/types";

export interface InvitationRow {
  id: string;
  email: string;
  role: MemberRole | null;
  status: string;
  invitedAt: Date;
  expiresAt: Date;
  inviterName: string | null;
}

export interface InvitationListProps extends UnsuccessfulState, OrganisationId {
  invitations: List<InvitationRow>;
}

export interface InvitationItemProps {
  invitation: InvitationRow;
}

export interface InvitationsProps extends OrganisationId {}
