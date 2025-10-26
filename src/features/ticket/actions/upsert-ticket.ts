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
import { createSlug, ensureUniqueSlug } from "@/features/ticket/utils/slug";
import { prisma } from "@/lib/prisma";
import { homePath, ticketPath } from "@/path";
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

    // Generate slug from title
    const baseSlug = createSlug(data.title);

    // Get existing slugs to ensure uniqueness
    const existingSlugs = await prisma.ticket.findMany({
      select: { slug: true },
      where: id ? { slug: { not: undefined } } : undefined, // Exclude current ticket when updating
    });

    const slug = ensureUniqueSlug(
      baseSlug,
      existingSlugs.map((t) => t.slug),
    );

    const dbData = {
      ...data,
      slug,
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
    if (ticket.slug) {
      revalidateTag(`ticket-slug-${ticket.slug}`, "max");
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
