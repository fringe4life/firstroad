"use server";

import { paginateItems } from "@/features/pagination/dal/paginate-items";
import type {
  OffsetPaginationType,
  PaginatedResult,
} from "@/features/pagination/types";
import { transformToPaginatedResult } from "@/features/pagination/utils/to-paginated-result";
import { getTicketListApi } from "@/features/ticket/queries/get-ticket-list-api";
import { getTicketsCount } from "@/features/ticket/queries/get-tickets-count";
import type { BaseTicket } from "@/features/ticket/types";
import type { SortOrder } from "@/generated/prisma/internal/prismaNamespace";
import type {
  TicketOrderByWithRelationInput,
  TicketWhereInput,
} from "@/generated/prisma/models/Ticket";
import type { Maybe } from "@/types";

export const getTicketsApi = async ({
  search,
  sortKey,
  sortValue,
  page,
  limit,
}: {
  search: Exclude<Maybe<string>, null>;
  sortKey: string;
  sortValue: SortOrder;
  page: number;
  limit: number;
}): Promise<PaginatedResult<BaseTicket>> => {
  // Build orderBy based on sort parameter
  let orderBy: TicketOrderByWithRelationInput = {
    createdAt: sortValue,
  };

  if (sortKey === "bounty") {
    orderBy = { bounty: sortValue };
  }

  const where: TicketWhereInput = {
    title: {
      contains: search,
      mode: "insensitive",
    },
  };

  const skip = page * limit;
  const takeAmount = limit;

  // data access layer
  const result = await paginateItems({
    getItems: () => getTicketListApi({ where, orderBy, takeAmount, skip }),
    getItemsCount: () => getTicketsCount({ where, orderBy }),
  });

  // data transfer object
  return transformToPaginatedResult(result, {
    page,
    limit,
    type: "offset",
  } as OffsetPaginationType);
};
