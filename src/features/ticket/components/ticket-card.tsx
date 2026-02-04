import { ViewTransition } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TICKET_ICONS } from "@/features/constants";
import type { BaseTicket } from "@/features/ticket/types";
import { toCurrencyFromCent } from "@/utils/currency";

interface TicketCardProps {
  ticket: BaseTicket;
  actions?: React.ReactNode;
  variant?: "list" | "detail";
}

/**
 * Base ticket card component - SSG-compatible (no user context dependencies)
 * Renders the ticket information with optional action buttons
 */
const TicketCard = ({ ticket, actions, variant = "list" }: TicketCardProps) => {
  return (
    <ViewTransition
      enter="ticket-card-enter"
      exit="ticket-card-exit"
      name={`ticket-${ticket.id}`}
    >
      <div className="grid grid-flow-col grid-cols-[1fr_36px] gap-x-2">
        <Card
          className="w-full overflow-hidden detail:border-primary/20 detail:shadow-lg"
          data-detail={variant === "detail" ? "true" : undefined}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-x-2">
              <span>{TICKET_ICONS[ticket.status]}</span>
              <span className="truncate">{ticket.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="line-clamp-3 detail:line-clamp-none whitespace-break-spaces detail:text-base">
              {ticket.description}
            </span>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-muted-foreground text-sm">
              {ticket.deadline.toLocaleString()} by {ticket.user.name}
            </p>
            <p className="text-muted-foreground text-sm">
              {toCurrencyFromCent(ticket.bounty)}
            </p>
          </CardFooter>
        </Card>

        {actions && <div className="space-y-1 self-start">{actions}</div>}
      </div>
    </ViewTransition>
  );
};

export { TicketCard };
