"use cache";

import { prisma } from "@firstroad/db";
import { cacheTag } from "next/cache";
import type { List } from "@/types";
import { attachmentsForTicketCache } from "@/utils/cache-tags";
import { tryCatch } from "@/utils/try-catch";
import type { AttachmentRecord } from "../../attachments/types";

const getAttachmentsByTicket = async (
  ticketId: string,
): Promise<List<AttachmentRecord>> => {
  cacheTag(attachmentsForTicketCache(ticketId));
  const { data: rows } = await tryCatch(() =>
    prisma.ticketAttachment.findMany({
      where: { ticketId },
      orderBy: { id: "asc" },
      select: { id: true, name: true, contentType: true },
    }),
  );
  return rows;
};

export { getAttachmentsByTicket };
