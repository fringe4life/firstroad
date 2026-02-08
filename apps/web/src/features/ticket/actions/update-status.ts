"use server";

import { prisma } from "@firstroad/db";
import type { TicketStatus } from "@firstroad/db/client-types";
import { itemWithOwnership } from "@/features/auth/dto/item-with-ownership";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { getMemberPermission } from "@/features/memberships/queries/get-member-permission";
import { invalidateTicketAndList } from "@/utils/invalidate-cache";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";
import { findTicket } from "../queries/find-ticket";

export const updateStatus = async (newValue: TicketStatus, id: string) => {
  const user = await getUserOrRedirect();

  const { data: slug, error } = await tryCatch(async () => {
    // Verify ticket exists and user is owner
    const ticket = await itemWithOwnership(findTicket(id), user);

    if (!ticket?.isOwner) {
      throw new Error("Ticket Not Found");
    }

    // Check if user has permission to update tickets in this organization
    const permission = await getMemberPermission(
      user.id,
      ticket.organizationId,
    );

    if (!permission?.canUpdateTicket) {
      throw new Error("You do not have permission to update this ticket");
    }

    // is owner and can update ticket, update status
    await prisma.ticket.update({
      where: { id },
      data: {
        status: newValue,
      },
    });
    // return slug to invalidate cache
    return ticket.slug;
  });

  if (error) {
    return fromErrorToActionState(error);
  }

  if (slug) {
    invalidateTicketAndList(slug);
  }
  return toActionState("Status updated", "SUCCESS");
};
