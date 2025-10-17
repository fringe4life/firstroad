type TicketRouteInfo = {
  isListView: boolean;
  isDetailView: boolean;
  isEditView: boolean;
  ticketId: string | null;
};

/**
 * Parses the optional catch-all ticketId segments to determine the active view
 * @param ticketId - Optional array from [[...ticketId]] route
 * @returns Object with view states and parsed ticketId
 *
 * @example
 * parseTicketRoute(undefined)           // { isListView: true, ... }
 * parseTicketRoute([])                  // { isListView: true, ... }
 * parseTicketRoute(['abc123'])          // { isDetailView: true, ticketId: 'abc123' }
 * parseTicketRoute(['abc123', 'edit'])  // { isEditView: true, ticketId: 'abc123' }
 */
export function parseTicketRoute(
  ticketId: string[] | undefined,
): TicketRouteInfo {
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
}
