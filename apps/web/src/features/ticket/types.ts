import type { TicketGetPayload, TicketModel } from "@firstroad/db/client-types";
import type { Id, List, Maybe, SearchParamsProps } from "@/types";
import type { IsOwner, UserVerifiable } from "../auth/types";
import type { ResourcePermission } from "../memberships/types";
import type { OrganisationId } from "../organisation/types";

// Base ticket with user for display

export type BaseTicket = TicketGetPayload<{
  include: { user: { select: { name: true } } };
}>;

export interface TicketCardProps {
  actions?: React.ReactNode;
  mobileActions?: React.ReactNode;
  sortKey?: string;
  ticket: BaseTicket;
  variant?: "list" | "detail";
}

export interface ByOrganisation {
  byOrganisation?: boolean;
}

export interface TicketsProps extends SearchParamsProps, ByOrganisation {
  userId?: Exclude<Maybe<string>, null>;
}

export interface TicketListProps {
  sortKey: string;
  tickets: List<TicketWithAccess>;
}

/**
 * Minimal props for list-row actions (client). Used at RSC boundary so only
 * these fields are serialized, not the full ticket. Do not add event handlers
 * here—they cannot be passed from server components; the client component
 * supplies onActionClick internally for the mobile variant.
 */
export interface TicketListRowActionsProps
  extends Pick<TicketWithAccess, "canDelete" | "canUpdate" | "isOwner"> {
  ticket: Pick<BaseTicket, "id" | "slug" | "status">;
  /** "desktop" for actions slot, "mobile" for mobileActions slot. */
  variant: "desktop" | "mobile";
}

/**
 * Access control properties for a ticket.
 * Item-scoped flags (canUpdate, canDelete) live here; org-scoped canCreate
 * should be attached at a higher level (e.g. list/page context) when needed.
 */
export interface TicketAccess
  extends IsOwner,
    Pick<ResourcePermission, "canUpdate" | "canDelete"> {}

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

export interface TicketMoreMenuProps extends Partial<ResourcePermission> {
  ticket: Pick<BaseTicket, "id" | "status">;
  trigger: React.ReactNode;
}

export interface VerifyTicket
  extends UserVerifiable,
    Id,
    OrganisationId,
    Pick<TicketModel, "slug"> {}

/**
 * Options for addTicketsAccess when ownership/permissions are pre-computed
 */
export interface AddTicketsAccessOptions {
  /** When true, all tickets are owned by the user (skip isOwner checks) */
  allOwned?: boolean;
  /** Pre-fetched permissions map to avoid additional query */
  permissionsMap?: Map<string, ResourcePermission>;
}

interface ReferencedTicket extends Pick<BaseTicket, "slug" | "title"> {}

export interface ReferencedTicketsProps {
  referencedTickets: List<ReferencedTicket>;
}

export interface ReferencedTicketItemProps {
  referencedTicket: ReferencedTicket;
}
