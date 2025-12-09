import { cacheTag } from "next/cache";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Maybe } from "@/types";
import type { BaseTicket } from "../types";

export const getTicketBySlug = cache(
  async (slug: string): Promise<Maybe<BaseTicket>> => {
    // Only cache the database query
    "use cache";
    cacheTag("tickets");
    cacheTag(`ticket-slug-${slug}`);

    return await prisma.ticket.findUnique({
      where: { slug },
      include: {
        userInfo: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  },
);
