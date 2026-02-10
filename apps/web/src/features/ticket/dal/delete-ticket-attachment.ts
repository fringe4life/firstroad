"use server";

import { deleteAttachmentForOwner } from "@/features/attachments/utils/attachment-dal";
import type { DeleteTicketAttachmentInput } from "../types";

const deleteTicketAttachmentRecord = async ({
  organizationId,
  ticketId,
  attachmentId,
}: DeleteTicketAttachmentInput): Promise<void> =>
  deleteAttachmentForOwner({
    ownerKind: "ticket",
    organizationId,
    ownerId: ticketId,
    attachmentId,
  });

export { deleteTicketAttachmentRecord };
