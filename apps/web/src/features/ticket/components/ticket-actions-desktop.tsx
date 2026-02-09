"use client";

import type { TicketStatus } from "@firstroad/db/client-types";
import {
  LucideMoreVertical,
  LucidePencil,
  SquareArrowOutUpRight,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { TicketMoreMenu } from "@/features/ticket/components/ticket-more-menu";
import type { TicketAccess } from "@/features/ticket/types";
import { cn } from "@/lib/utils";
import { ticketEditPath, ticketPath } from "@/path";

interface TicketActionsDesktopProps extends TicketAccess {
  ticket: { slug: string; id: string; status: TicketStatus };
  variant: "list" | "detail";
}

const TicketActionsDesktop = ({
  ticket,
  variant,
  isOwner,
  canUpdateTicket,
  canDeleteTicket,
}: TicketActionsDesktopProps) => {
  if (!isOwner) {
    return null;
  }

  const viewLink =
    variant === "list" ? (
      <Link
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "xs:flex hidden",
        )}
        href={ticketPath(ticket.slug)}
        prefetch
      >
        <SquareArrowOutUpRight className="aspect-square w-4" />
      </Link>
    ) : null;

  const editLink = canUpdateTicket ? (
    <Link
      className={buttonVariants({ variant: "outline", size: "icon" })}
      href={ticketEditPath(ticket.slug)}
      prefetch
    >
      <LucidePencil className="aspect-square w-4" />
    </Link>
  ) : null;

  const moreMenu =
    variant === "detail" ? (
      <TicketMoreMenu
        canDeleteTicket={canDeleteTicket}
        canUpdateTicket={canUpdateTicket}
        ticket={{ id: ticket.id, status: ticket.status }}
        trigger={
          <Button size="icon" variant="outline">
            <LucideMoreVertical className="aspect-square w-4" />
          </Button>
        }
      />
    ) : null;

  return (
    <>
      {viewLink}
      {editLink}
      {moreMenu}
    </>
  );
};

export { TicketActionsDesktop };
