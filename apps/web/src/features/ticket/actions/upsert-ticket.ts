/** biome-ignore-all lint/style/noMagicNumbers: numbers are called in a max function */
"use server";
import { createSlug } from "@firstroad/utils";
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
import { getMemberPermission } from "@/features/memberships/queries/get-member-permission";
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
import { createTicket, updateTicket } from "../dal/ticket-crud";
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

  const organizationId = user.activeOrganizationId;

  if (!organizationId) {
    return toActionState("User is not a member of an organisation", "ERROR");
  }

  const formDataObject = Object.fromEntries(formData.entries());
  const result = safeParse(upsertSchema, formDataObject);
  if (!result.success) {
    return fromErrorToActionState(result.issues, formData);
  }
  const slug = createSlug(result.output.title);

  const { error } = await tryCatch(async () => {
    if (id) {
      const ticket = await itemWithOwnership(findTicket(id), user);
      if (!ticket?.isOwner) {
        throw new Error("Ticket Not Found");
      }

      // Check if user has permission to update tickets in this organization
      const permission = await getMemberPermission(
        user.id,
        ticket.organizationId,
        "TICKET",
      );

      if (!permission?.canUpdate) {
        throw new Error("You do not have permission to update this ticket");
      }
    } else {
      // Check if user has permission to create tickets in this organization
      const permission = await getMemberPermission(
        user.id,
        organizationId,
        "TICKET",
      );

      if (!permission?.canCreate) {
        throw new Error("You do not have permission to create tickets");
      }
    }

    const {
      output: { deadline, bounty, title, description },
    } = result;

    const dbData = {
      title,
      slug,
      deadline: new Date(deadline),
      bounty: toCent(bounty),
      userId: user.id,
      description,
    };
    const ticket = id
      ? await updateTicket({
          where: { id },
          data: dbData,
          includeUser: false,
        })
      : await createTicket({
          data: { ...dbData, organizationId },
          includeUser: false,
        });

    if (ticket.slug) {
      invalidateTicketAndList(ticket.slug);
    }
  });

  if (error) {
    return fromErrorToActionState(error, formData);
  }

  if (id) {
    await setCookieByKey("toast", "Ticket updated");
    redirect(ticketsPath());
  }

  await setCookieByKey("toast", "Ticket created");
  redirect(ticketPath(slug));
};
export { upsertTicket };
