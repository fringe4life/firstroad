import type { TicketGetPayload } from "@/generated/prisma/models/Ticket";
import type { List, Maybe, SearchParamsProps } from "@/types";
// Base ticket with user for display
export type BaseTicket = TicketGetPayload<{
  include: { user: { select: { name: true } } };
}>;

export interface TicketsProps extends SearchParamsProps {
  userId?: Exclude<Maybe<string>, null>;
}

export interface TicketListProps {
  tickets: List<BaseTicket>;
}

export interface TicketItemProps {
  ticket: BaseTicket;
  isDetail?: boolean;
  comments?: React.ReactNode;
  currentUserId?: Exclude<Maybe<string>, null>;
}

export interface TicketOwnerOptionsProps extends TicketItemProps {}
