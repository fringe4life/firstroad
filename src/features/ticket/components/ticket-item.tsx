import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { ViewTransition } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TICKET_ICONS } from "@/features/constants";
import { TicketOwnerOptions } from "@/features/ticket/components/ticket-owner-options";
import type { TicketItemProps } from "@/features/ticket/types";
import { ticketPath } from "@/path";
import { toCurrencyFromCent } from "@/utils/currency";

const TicketItem = ({
  ticket,
  isDetail = false,
  comments,
  currentUserId,
}: TicketItemProps) => {
  const detailButton = (
    <Link
      className={buttonVariants({ variant: "outline", size: "icon" })}
      href={ticketPath(ticket.slug)}
      prefetch
    >
      <SquareArrowOutUpRight className="aspect-square w-10" />
    </Link>
  );

  const ticketStub = {
    userId: ticket.userId,
    slug: ticket.slug,
    id: ticket.id,
    status: ticket.status,
  };

  return (
    <ViewTransition
      enter="ticket-card-enter"
      exit="ticket-card-exit"
      name={`ticket-${ticket.id}`}
    >
      <div
        className="max-content-narrow detail:max-content-widest grid gap-y-4 self-start justify-self-center"
        data-detail={isDetail}
      >
        <div className="grid grid-flow-col grid-cols-[1fr_36px] gap-x-2">
          <Card className="w-full overflow-hidden detail:border-primary/20 detail:shadow-lg">
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

          <div className="space-y-1 self-start">
            {isDetail ? (
              <TicketOwnerOptions
                currentUserId={currentUserId}
                isDetail={true}
                ticket={ticketStub}
              />
            ) : (
              <>
                {detailButton}
                <TicketOwnerOptions
                  currentUserId={currentUserId}
                  ticket={ticketStub}
                />
              </>
            )}
          </div>
        </div>
        {comments}
      </div>
    </ViewTransition>
  );
};

export { TicketItem };
