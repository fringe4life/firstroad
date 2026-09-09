import { orm } from "@firstroad/db";
import { cacheTag } from "next/cache";
import { ticketsCache } from "@/utils/cache-tags";
import { tryCatch } from "@/utils/try-catch";

export interface TicketStats {
  done: number;
  inProgress: number;
  open: number;
  total: number;
}

export const getUserTicketStats = async (
  userId: string,
): Promise<TicketStats> => {
  "use cache";
  cacheTag(ticketsCache());

  const { data } = await tryCatch(() =>
    orm.Ticket.where({ userId })
      .groupBy("status")
      .aggregate((aggregate) => ({ count: aggregate.count() })),
  );

  const stats: TicketStats = {
    done: 0,
    inProgress: 0,
    open: 0,
    total: 0,
  };

  if (data) {
    for (const { count, status } of data) {
      stats.total += count;

      switch (status) {
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
          throw new Error(`Invalid ticket status: ${status}`) as never;
      }
    }
  }

  return stats;
};
