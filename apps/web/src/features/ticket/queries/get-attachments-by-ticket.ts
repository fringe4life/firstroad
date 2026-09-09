"use cache";

import { orm } from "@firstroad/db";
import { cacheTag } from "next/cache";
import type { List } from "@/types";
import { attachmentsForTicketCache } from "@/utils/cache-tags";
import { tryCatch } from "@/utils/try-catch";
import type { AttachmentRecord } from "../../attachments/types";

const getAttachmentsByTicket = async (
  ticketId: string,
): Promise<List<AttachmentRecord>> => {
  cacheTag(attachmentsForTicketCache(ticketId));
  const { data: rows } = await tryCatch(async () =>
    orm.TicketAttachment.where({ ticketId })
      .select("contentType", "id", "name")
      .orderBy((attachment) => attachment.id.asc())
      .all(),
  );
  return rows;
};

export { getAttachmentsByTicket };
