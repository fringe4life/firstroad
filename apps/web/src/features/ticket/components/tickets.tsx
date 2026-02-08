import { Suspense } from "react";
import { Suspend } from "@/components/suspend";
import { TICKET_SORT_OPTIONS } from "@/features/constants";
import { PaginationSkeleton } from "@/features/pagination/components/pagination-skeleton";
import { TicketSearchInput } from "@/features/ticket/components/ticket-search-input";
import { TicketSortSelect } from "@/features/ticket/components/ticket-select-sort";
import type { TicketsProps } from "@/features/ticket/types";
import { TicketControlsFallback } from "./skeletons/ticket-controls-skeleton";
import { TicketListSkeleton } from "./skeletons/ticket-list-skeleton";
import { TicketListPagination } from "./ticket-list-pagination";

const Tickets = ({ searchParams, userId, byOrganisation }: TicketsProps) => (
  <div className="max-content-widest mx-auto grid grid-rows-[min-content_1fr_36px] justify-items-center gap-y-4">
    <Suspend fallback={<TicketControlsFallback />}>
      {/* Desktop: Stacked layout */}
      <div className="max-content-narrow grid xs:grid-flow-col xs:grid-cols-2 gap-2">
        <TicketSearchInput placeholder="Search tickets ..." />
        <TicketSortSelect options={TICKET_SORT_OPTIONS} />
      </div>
    </Suspend>
    <Suspense
      fallback={
        <>
          <TicketListSkeleton />
          <PaginationSkeleton />
        </>
      }
    >
      <TicketListPagination
        byOrganisation={byOrganisation}
        searchParams={searchParams}
        userId={userId}
      />
    </Suspense>
  </div>
);

export { Tickets };
