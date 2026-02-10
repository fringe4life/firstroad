"use server";

import type { AttachmentRecord } from "@/features/attachments/types";
import { createAttachmentsForOwner } from "@/features/attachments/utils/attachment-dal";
import type { List } from "@/types";
import type { CreateTicketAttachmentsInput } from "../types";

const createTicketAttachments = async ({
  organizationId,
  ticketId,
  files,
}: CreateTicketAttachmentsInput): Promise<List<AttachmentRecord>> =>
  createAttachmentsForOwner({
    ownerKind: "ticket",
    organizationId,
    ownerId: ticketId,
    files,
  });

export { createTicketAttachments };
