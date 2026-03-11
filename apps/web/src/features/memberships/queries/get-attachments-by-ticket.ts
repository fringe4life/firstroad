"use cache";

import { prisma } from "@firstroad/db";
import { cacheTag } from "next/cache";
import type { AttachmentRecord } from "@/features/attachments/types";
import type { List } from "@/types";
import { ticketAttachmentsCache } from "@/utils/cache-tags";
import { tryCatch } from "@/utils/try-catch";

const getAttachmentsByTicket = async (
  ticketId: string,
): Promise<List<AttachmentRecord>> => {
  cacheTag(ticketAttachmentsCache());

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
