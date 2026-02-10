"use server";

import { prisma } from "@firstroad/db";
import type {
  TicketCreateInput,
  TicketUncheckedCreateInput,
  TicketUncheckedUpdateInput,
  TicketUpdateInput,
  TicketWhereUniqueInput,
} from "@firstroad/db/client-types";
import { TICKET_WITH_USER_INCLUDE } from "@/features/ticket/constants";

type TicketCreateData = TicketCreateInput | TicketUncheckedCreateInput;
type TicketUpdateData = TicketUpdateInput | TicketUncheckedUpdateInput;

interface TicketCreateArgs {
  data: TicketCreateData;
  includeUser?: boolean;
}

interface TicketUpdateArgs {
  where: TicketWhereUniqueInput;
  data: TicketUpdateData;
  includeUser?: boolean;
}

/**
 * Low-level DAL for ticket CRUD.
 *
 * These helpers centralize Prisma access for tickets and provide an option
 * to include the common "ticket with user name" shape. Server actions
 * remain responsible for auth, validation, and cache invalidation.
 */
const createTicket = async ({ data, includeUser }: TicketCreateArgs) => {
  if (includeUser) {
    return await prisma.ticket.create({
      data,
      include: TICKET_WITH_USER_INCLUDE,
    });
  }

  return await prisma.ticket.create({ data });
};

const updateTicket = async ({ where, data, includeUser }: TicketUpdateArgs) => {
  if (includeUser) {
    return await prisma.ticket.update({
      where,
      data,
      include: TICKET_WITH_USER_INCLUDE,
    });
  }

  return await prisma.ticket.update({
    where,
    data,
  });
};

const deleteTicketRecord = async (
  where: TicketWhereUniqueInput,
): Promise<void> => {
  await prisma.ticket.delete({
    where,
  });
};

export { createTicket, updateTicket, deleteTicketRecord };
