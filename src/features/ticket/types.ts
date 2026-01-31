import type {
  TicketGetPayload,
  TicketModel,
} from "@/generated/prisma/models/Ticket";
import type { Id, List, Maybe, SearchParamsProps } from "@/types";
import type { UserVerifiable } from "../auth/types";
import type { OrganisationId } from "../organisation/types";
// Base ticket with user for display
export type BaseTicket = TicketGetPayload<{
  include: { user: { select: { name: true } } };
}>;

export interface ByOrganisation {
  byOrganisation?: boolean;
}

export interface TicketsProps extends SearchParamsProps, ByOrganisation {
  userId?: Exclude<Maybe<string>, null>;
}

export interface TicketListProps {
  tickets: List<BaseTicket>;
}

export interface IsDetail {
  isDetail?: boolean;
}

export interface TicketItemProps extends IsDetail {
  ticket: BaseTicket;
  comments?: React.ReactNode;
  currentUserId?: Exclude<Maybe<string>, null>;
}

export interface TicketOwnerOptionsProps extends IsDetail {
  ticket: Pick<
    BaseTicket,
    "userId" | "slug" | "id" | "status" | "organizationId"
  >;
  currentUserId?: Exclude<Maybe<string>, null>;
}

export interface TicketMoreMenuProps {
  ticket: Pick<BaseTicket, "id" | "status">;
  trigger: React.ReactNode;
  canDeleteTicket?: boolean;
}

export interface VerifyTicket
  extends UserVerifiable,
    Id,
    OrganisationId,
    Pick<TicketModel, "slug"> {}
