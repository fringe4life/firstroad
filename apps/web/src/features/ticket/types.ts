import type { TicketGetPayload, TicketModel } from "@firstroad/db/client-types";
import type { Id, List, Maybe, SearchParamsProps } from "@/types";
import type { IsOwner, UserVerifiable } from "../auth/types";
import type { OrganisationId } from "../organisation/types";
// Base ticket with user for display
export type BaseTicket = TicketGetPayload<{
  include: { user: { select: { name: true } } };
}>;

export interface TicketCardProps {
  ticket: BaseTicket;
  actions?: React.ReactNode;
  variant?: "list" | "detail";
}

export interface ByOrganisation {
  byOrganisation?: boolean;
}

export interface TicketsProps extends SearchParamsProps, ByOrganisation {
  userId?: Exclude<Maybe<string>, null>;
}

export interface TicketListProps {
  tickets: List<TicketWithAccess>;
}

/**
 * Access control properties for a ticket
 */
export interface CanDeleteTicket {
  canDeleteTicket: boolean;
}

export interface CanUpdateTicket {
  canUpdateTicket: boolean;
}

export interface TicketAccess
  extends IsOwner,
    CanDeleteTicket,
    CanUpdateTicket {}

/**
 * Ticket with ownership and permission information
 */
export type TicketWithAccess = BaseTicket & TicketAccess;

export interface IsDetail {
  isDetail?: boolean;
}

/**
 * Props for TicketOwnerOptions when access is pre-computed (list pages)
 */
export interface TicketOwnerOptionsWithAccessProps
  extends IsDetail,
    TicketAccess {
  ticket: Pick<BaseTicket, "slug" | "id" | "status">;
}

/**
 * Props for TicketOwnerOptions when access needs to be fetched (detail pages)
 */
export interface TicketOwnerOptionsFetchProps extends IsDetail {
  ticket: Pick<
    BaseTicket,
    "userId" | "slug" | "id" | "status" | "organizationId"
  >;
}

/**
 * Combined props - either pre-computed access or needs fetch
 */
export type TicketOwnerOptionsProps =
  | TicketOwnerOptionsWithAccessProps
  | TicketOwnerOptionsFetchProps;

export interface TicketMoreMenuProps
  extends Partial<CanDeleteTicket & CanUpdateTicket> {
  ticket: Pick<BaseTicket, "id" | "status">;
  trigger: React.ReactNode;
}

export interface VerifyTicket
  extends UserVerifiable,
    Id,
    OrganisationId,
    Pick<TicketModel, "slug"> {}
