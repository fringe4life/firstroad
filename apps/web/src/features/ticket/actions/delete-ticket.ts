"use server";
import { redirect } from "next/navigation";
import { itemWithOwnership } from "@/features/auth/dto/item-with-ownership";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { getMemberPermission } from "@/features/memberships/queries/get-member-permission";
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
    const ticket = await itemWithOwnership(findTicket(id), user);

    // check if user is owner
    if (!ticket?.isOwner) {
      throw new Error("Ticket Not Found");
    }

    // check if user has permission to delete tickets in this organization
    const permission = await getMemberPermission(
      user.id,
      ticket.organizationId,
      "TICKET",
    );

    if (!permission?.canDelete) {
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
