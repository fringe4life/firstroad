import type { BaseTicket } from "@/features/ticket/types";

export type OptimisticTicketAction =
  | {
      type: "add";
      ticket: Omit<BaseTicket, "id" | "createdAt" | "updatedAt">;
    }
  | {
      type: "edit";
      ticketId: string;
      updates: Partial<BaseTicket>;
    }
  | { type: "delete"; ticketId: string };

const moveToFront = (tickets: BaseTicket[], ticketId: string) => {
  const item = tickets.find((ticket) => ticket.id === ticketId);
  if (!item) {
    return tickets;
  }
  return [item, ...tickets.filter((ticket) => ticket.id !== ticketId)];
};

export const ticketReducer = (
  state: BaseTicket[],
  action: OptimisticTicketAction,
): BaseTicket[] => {
  switch (action.type) {
    case "add":
      return [
        {
          ...action.ticket,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...state,
      ];
    case "edit": {
      const updated = state.map((ticket) =>
        ticket.id === action.ticketId
          ? {
              ...ticket,
              ...action.updates,
              updatedAt: new Date(),
            }
          : ticket,
      );
      return moveToFront(updated, action.ticketId);
    }
    case "delete":
      return state.filter((ticket) => ticket.id !== action.ticketId);
    default:
      throw new Error("Unexpected optimistic ticket action") as never;
  }
};
