"use server";

import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { SearchParams } from "nuqs/server";
import { getUser } from "@/features/auth/queries/get-user";
import { paginateItems } from "@/features/pagination/dal/paginate-items";
import { searchParamsCache } from "@/features/pagination/pagination-search-params";
import type { PaginatedResult } from "@/features/pagination/types";
import { transformToPaginatedResult } from "@/features/pagination/utils/to-paginated-result";
import { getTicketList } from "@/features/ticket/queries/get-ticket-list";
import { getTicketsCount } from "@/features/ticket/queries/get-tickets-count";
import type { BaseTicket } from "@/features/ticket/types";
import type {
  TicketOrderByWithRelationInput,
  TicketWhereInput,
} from "@/generated/prisma/models/Ticket";
import { onboardingPath, signInPath } from "@/path";
import type { Maybe } from "@/types";

export const getTickets = async (
  searchParams: Promise<SearchParams>,
  filterUserId?: Exclude<Maybe<string>, null>,
  byOrganisation = false,
): Promise<PaginatedResult<BaseTicket>> => {
  await connection();
  const { user } = await getUser();

  const organizationId = byOrganisation
    ? user?.activeOrganizationId
    : undefined;

  if (byOrganisation && !user) {
    throw redirect(signInPath());
  }

  if (byOrganisation && !organizationId) {
    throw redirect(onboardingPath());
  }
  // Parse search params (not cached - fast and user-specific)
  const resolvedSearchParams = await searchParams;
  const { search, sortKey, sortValue, page, limit } =
    searchParamsCache.parse(resolvedSearchParams);

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
    userId: byOrganisation ? undefined : filterUserId,
    // biome-ignore lint/style/noNonNullAssertion: have checked
    organizationId: byOrganisation ? organizationId! : undefined,
  };

  const skip = page * limit;
  const takeAmount = limit;

  // data access layer
  const result = await paginateItems({
    getItems: () => getTicketList({ where, orderBy, takeAmount, skip }),
    getItemsCount: () => getTicketsCount({ where, orderBy }),
  });

  // data transfer object
  return transformToPaginatedResult(result, { page, limit, type: "offset" });
};
