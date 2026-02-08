"use cache";

import { prisma } from "@firstroad/db";
import { cacheTag } from "next/cache";
import type { List } from "@/types";
import { attachmentCache, attachmentsForTicketCache } from "@/utils/cache-tags";
import { tryCatch } from "@/utils/try-catch";
import type { AttachmentRecord } from "../types";

const getAttachmentsByTicket = async (
  ticketId: string,
): Promise<List<AttachmentRecord>> => {
  cacheTag(attachmentCache());
  cacheTag(attachmentsForTicketCache(ticketId));
  const { data: rows } = await tryCatch(() =>
    prisma.attachment.findMany({
      where: { ticketId },
      orderBy: { id: "asc" },
      select: { id: true, name: true, ticketId: true },
    }),
  );
  return rows;
};

export { getAttachmentsByTicket };
