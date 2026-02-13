"use server";
import type { TicketStatus } from "@firstroad/db/client-types";
import { itemWithPermissions } from "@/features/auth/dto/item-with-permissions";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { invalidateTicketAndList } from "@/utils/invalidate-cache";
import { fromErrorToActionState, toActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";
import { updateTicket } from "../dal/ticket-crud";
import { findTicket } from "../queries/find-ticket";

export const updateStatus = async (newValue: TicketStatus, id: string) => {
  const user = await getUserOrRedirect();

  const { data: slug, error } = await tryCatch(async () => {
    // Verify ticket exists and user is owner
    const ticket = await itemWithPermissions(findTicket(id), user, "TICKET");

    if (!ticket?.isOwner) {
      throw new Error("Ticket Not Found");
    }

    if (!ticket?.canUpdate) {
      throw new Error("You do not have permission to update this ticket");
    }

    // is owner and can update ticket, update status
    await updateTicket({
      where: { id },
      data: { status: newValue },
      includeUser: false,
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
