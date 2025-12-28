/** biome-ignore-all lint/style/noMagicNumbers: numbers are called in a max function */
"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  maxLength,
  minLength,
  minValue,
  object,
  parse,
  pipe,
  regex,
  string,
  toNumber,
} from "valibot";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import { createSlug } from "@/features/ticket/utils/slug";
import { prisma } from "@/lib/prisma";
import { homePath, ticketPath } from "@/path";
import type { Maybe } from "@/types";
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

    const data = parse(upsertSchema, Object.fromEntries(formData.entries()));

    // Generate slug from title
    const slug = createSlug(data.title);

    const dbData = {
      ...data,
      slug,
      deadline: new Date(data.deadline),
      bounty: toCent(data.bounty),
      userId: user.id,
    };
    const ticket = await prisma.ticket.upsert({
      where: {
        id: id || "",
      },
      update: dbData,
      create: dbData,
    });

    updateTag("tickets");
    if (ticket.id) {
      updateTag(`ticket-${ticket.id}`);
    }
    if (ticket.slug) {
      updateTag(`ticket-slug-${ticket.slug}`);
    }
  });

  if (error) {
    return fromErrorToActionState(error, formData);
  }

  if (id) {
    setCookieByKey("toast", "Ticket updated");
    redirect(homePath);
  }

  // For new tickets, redirect to the ticket page using the slug
  const data = parse(upsertSchema, Object.fromEntries(formData.entries()));
  const slug = createSlug(data.title);
  setCookieByKey("toast", "Ticket created");
  redirect(ticketPath(slug));
};
export { upsertTicket };
