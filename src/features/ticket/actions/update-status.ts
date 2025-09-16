"use server";

import { revalidatePath } from "next/cache";
import { getSessionOrRedirect } from "@/features/auth/queries/get-session-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import type { TicketStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/path";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

export const updateStatus = async (newValue: TicketStatus, id: string) => {
  const session = await getSessionOrRedirect();

  const { error } = await tryCatch(async () => {
    await prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.findUnique({
        where: {
          id,
        },
      });

      if (!(ticket && isOwner(session, ticket))) {
        throw new Error("Ticket Not Found");
      }

      await tx.ticket.update({
        where: { id },
        data: {
          status: newValue,
        },
      });
    });
  });

  if (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketsPath);

  return toActionState("Status updated", "SUCCESS");
};
