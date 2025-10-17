import { cache } from "react";

type TicketRouteInfo = {
  isListView: boolean;
  isDetailView: boolean;
  isEditView: boolean;
  ticketId: string | null;
};

/**
 * Parses the optional catch-all ticketId segments to determine the active view
 * Cached to prevent duplicate awaiting of params in generateMetadata and page component
 *
 * @param params - Params promise from PageProps (already a Promise)
 * @returns Promise resolving to object with view states and parsed ticketId
 *
 * @example
 * await parseTicketRoute(params) // params with undefined → { isListView: true, ... }
 * await parseTicketRoute(params) // params with [] → { isListView: true, ... }
 * await parseTicketRoute(params) // params with ['abc123'] → { isDetailView: true, ticketId: 'abc123' }
 * await parseTicketRoute(params) // params with ['abc123', 'edit'] → { isEditView: true, ticketId: 'abc123' }
 */
export const parseTicketRoute = cache(
  async (
    params: PageProps<"/tickets/[[...ticketId]]">["params"],
  ): Promise<TicketRouteInfo> => {
    const { ticketId } = await params;

    const isListView = !ticketId || ticketId.length === 0;
    const isEditView = Boolean(
      ticketId && ticketId.length === 2 && ticketId[1] === "edit",
    );
    const isDetailView = Boolean(
      ticketId && ticketId.length === 1 && !isEditView && !isListView,
    );
    const parsedTicketId = ticketId && ticketId.length > 0 ? ticketId[0] : null;

    return {
      isListView,
      isDetailView,
      isEditView,
      ticketId: parsedTicketId,
    };
  },
);
