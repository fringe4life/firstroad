"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fromErrorToActionState } from "@/features/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/path";
import { setCookieByKey } from "@/features/utils/cookies";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";

export const deleteTicket = async (id: string) => {
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

      await tx.ticket.delete({ where: { id } });
    });
  } catch (err) {
    return fromErrorToActionState(err);
  }
  
  revalidatePath(ticketsPath());
  setCookieByKey("toast", "Ticket deleted");
  redirect(ticketsPath());
};
