/** biome-ignore-all lint/style/noMagicNumbers: numbers are called in a max function */
"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  maxLength,
  minLength,
  number,
  object,
  parse,
  pipe,
  regex,
  string,
  transform,
} from "valibot";
import { getSessionOrRedirect } from "@/features/auth/queries/get-session-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import { prisma } from "@/lib/prisma";
import { homePath } from "@/path";
import { setCookieByKey } from "@/utils/cookies";
import { toCent } from "@/utils/currency";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const upsertSchema = object({
  title: pipe(string(), minLength(1), maxLength(191)),
  description: pipe(string(), minLength(1), maxLength(1024)),
  deadline: pipe(string(), regex(/^\d{4}-\d{2}-\d{2}$/, "Is required")),
  bounty: pipe(string(), transform(Number), number()),
});

const upsertTicket = async (
  id: string | undefined,
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const session = await getSessionOrRedirect();

  const { error } = await tryCatch(async () => {
    if (id) {
      const ticket = await prisma.ticket.findUnique({
        where: {
          id,
        },
      });

      if (!(ticket && isOwner(session, ticket))) {
        return toActionState("Ticket Not Found", "ERROR");
      }
    }

    const data = parse(upsertSchema, Object.fromEntries(formData.entries()));

    const dbData = {
      ...data,
      deadline: new Date(data.deadline),
      bounty: toCent(data.bounty),
      userId: session.user?.id as string,
    };
    const ticket = await prisma.ticket.upsert({
      where: {
        id: id || "",
      },
      update: dbData,
      create: dbData,
    });

    revalidateTag("tickets", "max");
    if (ticket.id) {
      revalidateTag(`ticket-${ticket.id}`, "max");
    }
  });

  if (error) {
    return fromErrorToActionState(error, formData);
  }

  if (id) {
    setCookieByKey("toast", "Ticket updated");
    redirect(homePath);
  }
  return toActionState("Ticket created", "SUCCESS");
};
export { upsertTicket };
