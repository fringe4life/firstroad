"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fromErrorToActionState } from "@/features/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/path";
import { setCookieByKey } from "./cookies";

export const deleteTicket = async (id: string) => {
  try {
    await prisma.ticket.delete({ where: { id } });
  } catch (err) {
    return fromErrorToActionState(err);
  }
  revalidatePath(ticketsPath());
  await setCookieByKey("toast", "Ticket deleted");
  redirect(ticketsPath());
};
