/** biome-ignore-all lint/style/noMagicNumbers: numbers are called in a max function */
"use server";

import { redirect } from "next/navigation";
import {
  maxLength,
  minLength,
  minValue,
  object,
  pipe,
  regex,
  safeParse,
  string,
  toNumber,
} from "valibot";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import { createSlug } from "@/features/ticket/utils/slug";
import { prisma } from "@/lib/prisma";
import { ticketPath, ticketsPath } from "@/path";
import type { Maybe } from "@/types";
import { setCookieByKey } from "@/utils/cookies";
import { toCent } from "@/utils/currency";
import { invalidateTicketAndList } from "@/utils/invalidate-cache";
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
  bounty: pipe(
    string(),
    toNumber(),
    minValue(0, "Bounty must be greater than 0"),
  ),
});

const upsertTicket = async (
  id: Maybe<string>,
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const user = await getUserOrRedirect();

  const { error } = await tryCatch(async () => {
    if (id) {
      const ticket = await prisma.ticket.findUnique({
        where: {
          id,
        },
      });

      if (!(ticket && isOwner(user, ticket))) {
        return toActionState("Ticket Not Found", "ERROR");
      }
    }

    const result = safeParse(
      upsertSchema,
      Object.fromEntries(formData.entries()),
    );
    if (!result.success) {
      return fromErrorToActionState(result.issues, formData);
    }

    // Generate slug from title
    const slug = createSlug(result.output.title);

    const dbData = {
      ...result.output,
      slug,
      deadline: new Date(result.output.deadline),
      bounty: toCent(result.output.bounty),
      userId: user.id,
    };
    const ticket = await prisma.ticket.upsert({
      where: {
        id: id || "",
      },
      update: dbData,
      create: dbData,
    });

    if (ticket.slug) {
      invalidateTicketAndList(ticket.slug);
    }
  });

  if (error) {
    return fromErrorToActionState(error, formData);
  }

  if (id) {
    setCookieByKey("toast", "Ticket updated");
    redirect(ticketsPath());
  }

  // For new tickets, redirect to the ticket page using the slug
  const result = safeParse(
    upsertSchema,
    Object.fromEntries(formData.entries()),
  );
  if (!result.success) {
    return fromErrorToActionState(result.issues, formData);
  }
  const slug = createSlug(result.output.title);
  setCookieByKey("toast", "Ticket created");
  redirect(ticketPath(slug));
};
export { upsertTicket };
