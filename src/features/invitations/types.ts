import type { List, UnsuccessfulState } from "@/types";
import type { OrganisationId } from "../organisation/types";

export interface InvitationRow {
  id: string;
  email: string;
  invitedAt: Date;
  inviterName: string | null;
}

export interface InvitationListProps extends UnsuccessfulState, OrganisationId {
  invitations: List<InvitationRow>;
}

export interface InvitationItemProps extends OrganisationId {
  invitation: InvitationRow;
}

export interface InvitationsProps extends OrganisationId {}
