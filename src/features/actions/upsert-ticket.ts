"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod/v4";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/features/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { signInPath, ticketsPath } from "@/path";
import { toCent } from "@/utils/currency";
import { setCookieByKey } from "./cookies";
import { auth } from "@/app/auth";
import { getAuthOrRedirect } from "../auth/queries/get-auth-or-redirect";
import { isOwner } from "../auth/utils/owner";

const upsertSchema = z.object({
  title: z.string().min(1).max(191),
  description: z.string().min(1).max(1024),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Is required"),
  bounty: z.coerce.number().positive(),
});

const upsertTicket = async (
  id: string | undefined,
  _state: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const session = await getAuthOrRedirect();
  try {

    if(id){
      const ticket = await prisma.ticket.findUnique({
          where: {
            id
          }
      })

      if(!ticket || !isOwner(session, ticket)) return toActionState("Ticket Not Found", "ERROR");
    }

    const data = upsertSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      deadline: formData.get("deadline"),
      bounty: formData.get("bounty"),
    });

    const dbData = {
      ...data,
      deadline: new Date(data.deadline),
      bounty: toCent(data.bounty),
      userId: session.user?.id,
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
  revalidatePath(ticketsPath());
  if (id) {
    await setCookieByKey("toast", "Ticket updated");
    redirect(ticketsPath());
  }
  return toActionState("Ticket created", "SUCCESS");
};

export { upsertTicket };
