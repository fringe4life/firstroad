import { Suspense } from "react";
import { Suspend } from "@/components/suspend";
import { TICKET_SORT_OPTIONS } from "@/features/constants";
import { PaginationSkeleton } from "@/features/pagination/components/pagination-skeleton";
import { TicketFilterDropdown } from "@/features/ticket/components/ticket-filter-dropdown";
import { TicketSearchInput } from "@/features/ticket/components/ticket-search-input";
import { TicketSortSelect } from "@/features/ticket/components/ticket-select-sort";
import type { TicketsProps } from "@/features/ticket/types";
import { TicketControlsFallback } from "./skeletons/ticket-controls-skeleton";
import { TicketListSkeleton } from "./skeletons/ticket-list-skeleton";
import { TicketListPagination } from "./ticket-list-pagination";

const Tickets = ({ searchParams, userId }: TicketsProps) => {
  return (
    <div className="max-content-widest mx-auto grid justify-items-center gap-y-4">
      <Suspend fallback={<TicketControlsFallback />}>
        {/* Desktop: Stacked layout */}
        <div className="max-content-narrow hidden gap-y-2 sm:grid">
          <div className="grid grid-flow-col grid-cols-2 gap-x-2">
            <TicketSearchInput placeholder="Search tickets ..." />
            <TicketSortSelect options={TICKET_SORT_OPTIONS} />
          </div>
        </div>

        {/* Mobile: Two-column layout with dropdown */}
        <div className="max-content-narrow grid gap-y-2 sm:hidden">
          <div className="grid grid-flow-col grid-cols-2 gap-x-2">
            <TicketSearchInput placeholder="Search tickets ..." />
            <TicketFilterDropdown />
          </div>
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
        <TicketListPagination searchParams={searchParams} userId={userId} />
      </Suspense>
    </div>
  );
};

export { Tickets };
