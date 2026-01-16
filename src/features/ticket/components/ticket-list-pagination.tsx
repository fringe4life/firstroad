import { Suspense, ViewTransition } from "react";
import { Pagination } from "@/features/pagination/components/nuqs-pagination";
import { getTickets } from "../dal/get-tickets";
import type { TicketsProps } from "../types";
import { TicketList } from "./ticket-list";

const TicketListPagination = async ({ searchParams, userId }: TicketsProps) => {
  const { list: tickets, metadata } = await getTickets(searchParams, userId);

  return (
    <>
      <TicketList tickets={tickets} />
      <div className="max-content-narrow">
        <Suspense>
          <ViewTransition>
            <Pagination metadata={metadata} />
          </ViewTransition>
        </Suspense>
      </div>
    </>
  );
};
export { TicketListPagination };
