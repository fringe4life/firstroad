"use server";

import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import type { TicketStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { invalidateTicketAndList } from "@/utils/invalidate-cache";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

export const updateStatus = async (newValue: TicketStatus, id: string) => {
  const session = await getUserOrRedirect();

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

      if (ticket.slug) {
        invalidateTicketAndList(ticket.slug);
      }
    });
  });

  if (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("Status updated", "SUCCESS");
};
