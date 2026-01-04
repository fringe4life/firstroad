import type { TicketGetPayload } from "@/generated/prisma/models/Ticket";
import type { Maybe, SearchParamsProps } from "@/types";
// Base ticket with userInfo for display
export type BaseTicket = TicketGetPayload<{
  include: { userInfo: { include: { user: { select: { name: true } } } } };
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
