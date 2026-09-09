"use cache";

import { orm } from "@firstroad/db";
import { cacheTag } from "next/cache";
import type { AttachmentRecord } from "@/features/attachments/types";
import type { List } from "@/types";
import { ticketAttachmentsCache } from "@/utils/cache-tags";
import { tryCatch } from "@/utils/try-catch";

const getAttachmentsByTicket = async (
  ticketId: string,
): Promise<List<AttachmentRecord>> => {
  cacheTag(ticketAttachmentsCache());

  const { data: rows } = await tryCatch(async () =>
    orm.TicketAttachment.where({ ticketId })
      .select("contentType", "id", "name")
      .orderBy((attachment) => attachment.id.asc())
      .all(),
  );

  return rows;
};

export { getAttachmentsByTicket };
