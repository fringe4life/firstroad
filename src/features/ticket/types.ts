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

export interface IsDetail {
  isDetail?: boolean;
}

export interface TicketItemProps extends IsDetail {
  ticket: BaseTicket;
  comments?: React.ReactNode;
  currentUserId?: Exclude<Maybe<string>, null>;
}

export interface TicketOwnerOptionsProps extends IsDetail {
  ticket: Pick<BaseTicket, "userId" | "slug" | "id" | "status">;
  currentUserId?: Exclude<Maybe<string>, null>;
}

export interface TicketMoreMenuProps {
  ticket: Pick<BaseTicket, "id" | "status">;
  trigger: React.ReactNode;
}
