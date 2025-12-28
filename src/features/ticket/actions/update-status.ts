"use server";

import { updateTag } from "next/cache";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import type { TicketStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
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

      updateTag("tickets");
      updateTag(`ticket-${id}`);
    });
  });

  if (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("Status updated", "SUCCESS");
};
