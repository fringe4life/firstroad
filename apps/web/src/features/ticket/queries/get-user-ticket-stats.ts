import { prisma } from "@firstroad/db";
import { cacheTag } from "next/cache";
import { ticketsCache } from "@/utils/cache-tags";
import { tryCatch } from "@/utils/try-catch";

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  done: number;
}

export const getUserTicketStats = async (
  userId: string,
): Promise<TicketStats> => {
  "use cache";
  cacheTag(ticketsCache());

  const { data } = await tryCatch(() =>
    prisma.ticket.groupBy({
      by: ["status"],
      where: { userId },
      _count: {
        id: true,
      },
    }),
  );

  const stats: TicketStats = {
    total: 0,
    open: 0,
    inProgress: 0,
    done: 0,
  };

  if (data) {
    for (const group of data) {
      const count = group._count.id;
      stats.total += count;

      switch (group.status) {
        case "OPEN":
          stats.open = count;
          break;
        case "IN_PROGRESS":
          stats.inProgress = count;
          break;
        case "DONE":
          stats.done = count;
          break;
        default:
          throw new Error(`Invalid ticket status: ${group.status}`) as never;
      }
    }
  }

  return stats;
};
