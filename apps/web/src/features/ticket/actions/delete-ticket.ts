"use server";
import { redirect } from "next/navigation";
import { itemWithPermissions } from "@/features/auth/dto/item-with-permissions";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { ticketsPath } from "@/path";
import { setCookieByKey } from "@/utils/cookies";
import { invalidateTicketAndList } from "@/utils/invalidate-cache";
import { fromErrorToActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";
import { deleteTicketRecord } from "../dal/ticket-crud";
import { findTicket } from "../queries/find-ticket";

export const deleteTicket = async (id: string) => {
  const { data: slug, error } = await tryCatch(async () => {
    // Get current user
    const user = await getUserOrRedirect();

    // verify ticket exists and user is owner
    const ticket = await itemWithPermissions(findTicket(id), user, "TICKET");

    // check if user is owner
    if (!ticket?.isOwner) {
      throw new Error("Ticket Not Found");
    }
    if (!ticket?.canDelete) {
      throw new Error("You do not have permission to delete this ticket");
    }

    // delete ticket
    await deleteTicketRecord({ id });

    return ticket.slug;
  });

  if (error) {
    return fromErrorToActionState(error);
  }

  // invalidate cache
  if (slug) {
    invalidateTicketAndList(slug);
  }

  await setCookieByKey("toast", "Ticket deleted");
  redirect(ticketsPath());
};
