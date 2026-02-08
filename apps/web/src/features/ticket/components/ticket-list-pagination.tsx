import { ViewTransition } from "react";
import { Pagination } from "@/features/pagination/components/nuqs-pagination";
import { PaginatedTransitions } from "@/features/pagination/components/paginated-transitions";
import { getTickets } from "../dal/get-tickets";
import type { TicketsProps } from "../types";
import { TicketListSkeleton } from "./skeletons/ticket-list-skeleton";
import { TicketList } from "./ticket-list";

const TicketListPagination = async ({
  searchParams,
  userId,
  byOrganisation,
}: TicketsProps) => {
  const { list: tickets, metadata } = await getTickets(
    searchParams,
    userId,
    byOrganisation,
  );

  return (
    <>
      <PaginatedTransitions
        fallback={<TicketListSkeleton />}
        metadata={{
          page: metadata.page,
        }}
      >
        <TicketList tickets={tickets} />
      </PaginatedTransitions>
      <div className="max-content-narrow">
        <ViewTransition>
          <Pagination metadata={metadata} />
        </ViewTransition>
      </div>
    </>
  );
};
export { TicketListPagination };
