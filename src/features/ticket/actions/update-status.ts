"use server";

import type { TicketStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getSessionOrRedirect } from "@/features/auth/queries/get-session-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import {
  fromErrorToActionState,
  toActionState,
} from "@/features/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/path";

export const updateStatus = async (newValue: TicketStatus, id: string) => {
  const session = await getSessionOrRedirect();

  try {
    await prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.findUnique({
        where: {
          id,
        },
      });

      if (!ticket || !isOwner(session, ticket)) {
        throw new Error("Ticket Not Found");
      }

      await tx.ticket.update({
        where: { id },
        data: {
          status: newValue,
        },
      });
    });
  } catch (err) {
    return fromErrorToActionState(err);
  }

  revalidatePath(ticketsPath);
  
  return toActionState("Status updated", "SUCCESS");
};
