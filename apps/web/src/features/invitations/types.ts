import type { List, Maybe, UnsuccessfulState } from "@/types";
import type { OrganisationId } from "../organisation/types";

export interface InvitationRow {
  email: string;
  id: string;
  invitedAt: Date;
  inviterName: Maybe<string>;
}

export interface InvitationListProps extends UnsuccessfulState, OrganisationId {
  invitations: List<InvitationRow>;
}

export interface InvitationItemProps extends OrganisationId {
  invitation: InvitationRow;
}

export interface InvitationsProps extends OrganisationId {}
