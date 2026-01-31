"use server";

import { redirect } from "next/navigation";
import { itemWithOwnership } from "@/features/auth/dto/item-with-ownership";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { getMemberPermission } from "@/features/memberships/queries/get-member-permission";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/path";
import { setCookieByKey } from "@/utils/cookies";
import { invalidateTicketAndList } from "@/utils/invalidate-cache";
import { fromErrorToActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";
import { findTicket } from "../queries/find-ticket";

export const deleteTicket = async (id: string) => {
  const { data: slug, error } = await tryCatch(async () => {
    // Get current user
    const user = await getUserOrRedirect();

    // verify ticket exists and user is owner
    const ticket = await itemWithOwnership(findTicket(id), user);

    // check if user is owner
    if (!ticket?.isOwner) {
      throw new Error("Ticket Not Found");
    }

    // check if user has permission to delete tickets in this organization
    const permission = await getMemberPermission(
      user.id,
      ticket.organizationId,
    );

    if (!permission?.canDeleteTicket) {
      throw new Error("You do not have permission to delete this ticket");
    }

    // delete ticket
    await prisma.ticket.delete({ where: { id } });

    return ticket.slug;
  });

  if (error) {
    return fromErrorToActionState(error);
  }

  // invalidate cache
  if (slug) {
    invalidateTicketAndList(slug);
  }

  setCookieByKey("toast", "Ticket deleted");
  redirect(ticketsPath());
};
