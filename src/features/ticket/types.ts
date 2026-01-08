import type { TicketGetPayload } from "@/generated/prisma/models/Ticket";
import type { Maybe, SearchParamsProps } from "@/types";
// Base ticket with user for display
export type BaseTicket = TicketGetPayload<{
  include: { user: { select: { name: true } } };
}>;

export interface TicketListProps extends SearchParamsProps {
  userId?: Exclude<Maybe<string>, null>;
}

export interface TicketItemProps {
  ticket: BaseTicket;
  isDetail?: boolean;
  comments?: React.ReactNode;
}

export interface TicketOwnerOptionsProps extends TicketItemProps {}
