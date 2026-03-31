/** biome-ignore-all lint/style/noMagicNumbers: numbers are called in a max function */
"use server";
import { createSlug } from "@firstroad/utils";
import { refresh } from "next/cache";
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
  ValiError,
} from "valibot";
import { optionalFilesSchema } from "@/features/attachments/schemas";
import { createAttachmentsForOwner } from "@/features/attachments/utils/attachment-dal";
import { filesWithContentType } from "@/features/attachments/utils/files-with-content-type";
import { getFilesFromFormData } from "@/features/attachments/utils/get-files-from-form-data";
import { itemWithPermissions } from "@/features/auth/dto/item-with-permissions";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { getMemberPermission } from "@/features/memberships/queries/get-member-permission";
import { ticketPath, ticketsPath } from "@/path";
import type { Maybe } from "@/types";
import { setCookieByKey } from "@/utils/cookies";
import { toCent } from "@/utils/currency";
import {
  invalidateAttachmentsForTicket,
  invalidateTicketAndList,
} from "@/utils/invalidate-cache";
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

  const { data: ticket, error } = await tryCatch(async () => {
    if (id) {
      const existing = await itemWithPermissions(
        findTicket(id),
        user,
        "TICKET",
      );
      if (!existing?.isOwner) {
        throw new Error("Ticket Not Found");
      }

      if (!existing?.canUpdate) {
        throw new Error("You do not have permission to update this ticket");
      }
    } else {
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
    return id
      ? await updateTicket({
          where: { id },
          data: dbData,
          includeUser: false,
        })
      : await createTicket({
          data: { ...dbData, organizationId },
          includeUser: false,
        });
  });

  if (error) {
    return fromErrorToActionState(error, formData);
  }

  if (!ticket) {
    return toActionState("Failed to save ticket", "ERROR");
  }

  const files = getFilesFromFormData(formData);
  if (files.length > 0) {
    const parseFiles = safeParse(optionalFilesSchema, files);
    if (!parseFiles.success) {
      return fromErrorToActionState(new ValiError(parseFiles.issues), formData);
    }
    const { error: attachError } = await tryCatch(() =>
      createAttachmentsForOwner({
        ownerKind: "ticket",
        organizationId: ticket.organizationId,
        ownerId: ticket.id,
        files: filesWithContentType(parseFiles.output),
      }),
    );
    if (attachError) {
      return fromErrorToActionState(attachError, formData);
    }
    invalidateAttachmentsForTicket(ticket.id);
  }

  invalidateTicketAndList(ticket.slug);
  refresh();

  if (id) {
    await setCookieByKey("toast", "Ticket updated");
    redirect(ticketsPath());
  }

  await setCookieByKey("toast", "Ticket created");
  redirect(ticketPath(slug));
};

export { upsertTicket };
