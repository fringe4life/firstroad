"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod/v4";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import { setCookieByKey } from "@/features/utils/cookies";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/features/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/path";
import { toCent } from "@/utils/currency";

const upsertSchema = z.object({
  title: z.string().min(1).max(191),
  description: z.string().min(1).max(1024),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Is required"),
  bounty: z.coerce.number().positive(),
});

const upsertTicket = async (
  id: string | undefined,
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const session = await getAuthOrRedirect();
  try {
    if (id) {
      const ticket = await prisma.ticket.findUnique({
        where: {
          id,
        },
      });

      if (!ticket || !isOwner(session, ticket))
        return toActionState("Ticket Not Found", "ERROR");
    }

    const data = upsertSchema.parse(Object.fromEntries(formData.entries()));

    const dbData = {
      ...data,
      deadline: new Date(data.deadline),
      bounty: toCent(data.bounty),
      userId: session.user?.id as string,
    };
    await prisma.ticket.upsert({
      where: {
        id: id || "",
      },
      update: dbData,
      create: dbData,
    });
  } catch (err: unknown) {
    console.log(err);
    return fromErrorToActionState(err, formData);
  }
  revalidatePath(ticketsPath);
  if (id) {
    await setCookieByKey("toast", "Ticket updated");
    redirect(ticketsPath);
  }
  return toActionState("Ticket created", "SUCCESS");
};

export { upsertTicket };
