"use server";

import { revalidatePath } from "next/cache";
import {
  fromErrorToActionState,
  toActionState,
  } from "@/features/utils/to-action-state";
  import type { TicketStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/path";
import { getAuthOrRedirect } from "../auth/queries/get-auth-or-redirect";
import { isOwner } from "../auth/utils/owner";

export const updateStatus = async (newValue: TicketStatus, id: string) => {
  const session = await getAuthOrRedirect();
  
  try {
    await prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.findUnique({
        where: {
          id,
        }
      });

      if(!ticket || !isOwner(session, ticket)) {
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
  
  revalidatePath(ticketsPath());
  return toActionState("Status updated", "SUCCESS");
};
