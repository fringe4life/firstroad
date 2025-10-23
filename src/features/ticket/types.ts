import type { TicketGetPayload } from "@/generated/prisma/models/Ticket";
// Base ticket with userInfo for display
export type BaseTicket = TicketGetPayload<{
  include: { userInfo: { include: { user: { select: { name: true } } } } };
}>;
