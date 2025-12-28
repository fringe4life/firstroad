import type { inferParserType } from "nuqs/server";
import type { TicketGetPayload } from "@/generated/prisma/models/Ticket";
import type { scopeParser } from "./search-params";
// Base ticket with userInfo for display
export type BaseTicket = TicketGetPayload<{
  include: { userInfo: { include: { user: { select: { name: true } } } } };
}>;

export type Scope = inferParserType<typeof scopeParser>;

export interface TicketItemProps {
  ticket: BaseTicket;
  isDetail?: boolean;
}

export interface TicketOwnerOptionsProps extends TicketItemProps {}
