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
import { itemWithOwnership } from "@/features/auth/dto/item-with-ownership";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { prisma } from "@/lib/prisma";
import { ticketPath, ticketsPath } from "@/path";
import type { Maybe } from "@/types";
import { setCookieByKey } from "@/utils/cookies";
import { toCent } from "@/utils/currency";
import { invalidateTicketAndList } from "@/utils/invalidate-cache";
import { createSlug } from "@/utils/slug";
import {
  type ActionState,
  fromErrorToActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";
import { findTicket } from "../queries/find-ticket";

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
  id: Exclude<Maybe<string>, null>,
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const user = await getUserOrRedirect();

  const formDataObject = Object.fromEntries(formData.entries());
  const result = safeParse(upsertSchema, formDataObject);
  if (!result.success) {
    return fromErrorToActionState(result.issues, formData);
  }
  const slug = createSlug(result.output.title);

  const { error } = await tryCatch(async () => {
    if (id) {
      const ticket = await itemWithOwnership(() => findTicket(id));
      if (!ticket?.isOwner) {
        throw new Error("Ticket Not Found");
      }
    }

    const {
      output: { deadline, bounty, title },
    } = result;

    const dbData = {
      title,
      slug,
      deadline: new Date(deadline),
      bounty: toCent(bounty),
      userId: user.id,
    };
    const ticket = await prisma.ticket.upsert({
      where: {
        id: id ?? "",
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

  setCookieByKey("toast", "Ticket created");
  redirect(ticketPath(slug));
};
export { upsertTicket };
