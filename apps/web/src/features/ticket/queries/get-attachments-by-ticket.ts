"use cache";

import { prisma } from "@firstroad/db";
import { cacheTag } from "next/cache";
import type { List } from "@/types";
import {
  attachmentsForTicketCache,
  ticketAttachmentsCache,
} from "@/utils/cache-tags";
import { tryCatch } from "@/utils/try-catch";
import type { AttachmentRecord } from "../../attachments/types";

const getAttachmentsByTicket = async (
  ticketId: string,
): Promise<List<AttachmentRecord>> => {
  cacheTag(ticketAttachmentsCache());
  cacheTag(attachmentsForTicketCache(ticketId));
  const { data: rows } = await tryCatch(() =>
    prisma.ticketAttachment.findMany({
      where: { ticketId },
      orderBy: { id: "asc" },
      select: { id: true, name: true },
    }),
  );
  return rows;
};

export { getAttachmentsByTicket };
