"use server";

import { revalidatePath } from "next/cache";
import {
  fromErrorToActionState,
  toActionState,
} from "@/features/utils/to-action-state";
import { TicketStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/path";

export const updateStatus = async (newValue: TicketStatus, id: string) => {
  try {
    await prisma.ticket.update({
      where: { id },
      data: {
        status: newValue,
      },
    });
  } catch (err) {
    return fromErrorToActionState(err);
  }
  revalidatePath(ticketsPath());
  return toActionState("Status updated", "SUCCESS");
};
