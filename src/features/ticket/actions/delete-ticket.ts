"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import { prisma } from "@/lib/prisma";
import { homePath } from "@/path";
import { setCookieByKey } from "@/utils/cookies";
import { fromErrorToActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

export const deleteTicket = async (id: string) => {
  const user = await getUserOrRedirect();

  const { error } = await tryCatch(async () => {
    await prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.findUnique({
        where: {
          id,
        },
      });

      if (!(ticket && isOwner(user, ticket))) {
        throw new Error("Ticket Not Found");
      }

      await tx.ticket.delete({ where: { id } });
      updateTag("tickets");
      updateTag(`ticket-${id}`);
    });
  });

  if (error) {
    return fromErrorToActionState(error);
  }

  setCookieByKey("toast", "Ticket deleted");
  redirect(homePath);
};
