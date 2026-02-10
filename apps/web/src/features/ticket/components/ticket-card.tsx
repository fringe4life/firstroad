import Link from "next/link";
import { ViewTransition } from "react";
import { ClientDate } from "@/components/client-date";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TICKET_ICONS } from "@/features/ticket/constants";
import type { TicketCardProps } from "@/features/ticket/types";
import { ticketPath } from "@/path";
import { toCurrencyFromCent } from "@/utils/currency";

/**
 * Base ticket card component - SSG-compatible (no user context dependencies)
 * Renders the ticket information with optional action buttons
 */
const TicketCard = ({
  ticket,
  actions,
  mobileActions,
  variant = "list",
}: TicketCardProps) => {
  let titleElement = <span className="truncate">{ticket.title}</span>;
  if (variant === "list") {
    titleElement = (
      <Link className="truncate" href={ticketPath(ticket.slug)} prefetch>
        {ticket.title}
        <span className="absolute inset-0 z-20 xs:hidden h-full w-full" />
      </Link>
    );
  }
  return (
    <ViewTransition
      enter="ticket-card-enter"
      exit="ticket-card-exit"
      name={`ticket-${ticket.id}`}
    >
      <div
        className="grid detail:grid-cols-[1fr_36px] grid-cols-1 gap-2 md:grid-flow-col md:grid-cols-[1fr_36px]"
        data-detail={variant === "detail" ? "true" : undefined}
      >
        <Card
          className="relative w-full overflow-hidden detail:border-primary/20 owner:border-primary/30 owner:bg-primary/7 detail:shadow-lg"
          data-detail={variant === "detail" ? "true" : undefined}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-x-2 truncate">
              <span>{TICKET_ICONS[ticket.status]}</span>
              {titleElement}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="line-clamp-3 detail:line-clamp-none whitespace-break-spaces detail:text-base">
              {ticket.description}
            </span>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <div className="flex w-full items-center justify-between">
              <p className="self-center text-muted-foreground text-sm">
                <ClientDate date={ticket.deadline} />{" "}
                <span className="block xs:inline xs:text-left text-right italic">
                  by {ticket.user.name}
                </span>
              </p>
              <p className="text-muted-foreground text-sm">
                {toCurrencyFromCent(ticket.bounty)}
              </p>
            </div>
            {mobileActions && (
              <div className="no-scrollbar relative z-30 flex w-full gap-2 overflow-x-auto md:hidden">
                {mobileActions}
              </div>
            )}
          </CardFooter>
        </Card>

        {actions && (
          <div className="hidden space-y-1 self-start md:flex md:flex-col">
            {actions}
          </div>
        )}
      </div>
    </ViewTransition>
  );
};

export { TicketCard };
