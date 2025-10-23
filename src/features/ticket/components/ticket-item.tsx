import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { ViewTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TICKET_ICONS } from "@/features/constants";
import TicketOwnerOptions from "@/features/ticket/components/ticket-owner-options";
import type { BaseTicket } from "@/features/ticket/types";
import { ticketPath } from "@/path";
import { toCurrencyFromCent } from "@/utils/currency";

type TicketItemProps = {
  ticket: BaseTicket;
  children?: React.ReactNode;
};

const TicketItem = ({ ticket, children }: TicketItemProps) => {
  const detailButton = (
    <Button asChild size="icon" variant="outline">
      <Link href={ticketPath(ticket.id)} prefetch>
        <SquareArrowOutUpRight className="size-4" />
      </Link>
    </Button>
  );

  return (
    <div
      className="grid w-full max-w-105 gap-y-4 data-[detail=true]:max-w-120"
      data-detail={!!children}
    >
      <div className="flex gap-x-2">
        <ViewTransition name={`ticket-card-${ticket.id}`}>
          <Card className="w-full overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <span>{TICKET_ICONS[ticket.status]}</span>
                <span className="truncate">{ticket.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="line-clamp-3 whitespace-break-spaces data-[detail=true]:line-clamp-none">
                {ticket.description}
              </span>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-muted-foreground text-sm">
                {ticket.deadline.toLocaleDateString()} by{" "}
                {ticket.userInfo.user.name}
              </p>
              <p className="text-muted-foreground text-sm">
                {toCurrencyFromCent(ticket.bounty)}
              </p>
            </CardFooter>
          </Card>
        </ViewTransition>

        <div className="flex flex-col gap-y-1">
          {children ? (
            <TicketOwnerOptions isDetail={true} ticket={ticket} />
          ) : (
            <>
              {detailButton}
              <TicketOwnerOptions ticket={ticket} />
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default TicketItem;
