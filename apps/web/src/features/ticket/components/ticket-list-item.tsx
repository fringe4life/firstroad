"use client";
import type { TicketStatus } from "@firstroad/db/client-types";
import { LucidePencil, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog/index";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TICKET_STATUS_LABELS } from "@/features/constants";
import { deleteTicket } from "@/features/ticket/actions/delete-ticket";
import { updateStatus } from "@/features/ticket/actions/update-status";
import { TicketCard } from "@/features/ticket/components/ticket-card";
import type { BaseTicket, TicketAccess } from "@/features/ticket/types";
import { cn } from "@/lib/utils";
import { ticketEditPath, ticketPath } from "@/path";

interface TicketListItemProps extends TicketAccess {
  ticket: BaseTicket;
}

/**
 * Ticket component for list views
 * Displays ticket card with link button and owner options
 */
const TicketListItem = ({
  ticket,
  isOwner,
  canDeleteTicket,
  canUpdateTicket,
}: TicketListItemProps) => {
  const { slug, id, status } = ticket;

  const handleStatusChange = async (value: string) => {
    const promise = updateStatus(value as TicketStatus, id);

    toast.promise(promise, {
      loading: "Updating status",
    });

    const result = await promise;

    if (result.status === "ERROR") {
      toast.error(result.message);
    } else if (result.status === "SUCCESS") {
      toast.success(result.message);
    }
  };

  // Desktop actions (sidebar)
  const desktopActions = (
    <>
      <Link
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "xs:flex hidden",
        )}
        href={ticketPath(slug)}
        prefetch
      >
        <SquareArrowOutUpRight className="aspect-square w-4" />
      </Link>
      {isOwner && canUpdateTicket && (
        <Link
          className={buttonVariants({ variant: "outline", size: "icon" })}
          href={ticketEditPath(slug)}
          prefetch
        >
          <LucidePencil className="aspect-square w-4" />
        </Link>
      )}
    </>
  );

  // Mobile actions (bottom bar)
  const mobileActions = isOwner ? (
    <>
      {canUpdateTicket && (
        <Button
          asChild
          className="flex-1 md:flex-none"
          onClick={(e) => e.stopPropagation()}
          size="sm"
          variant="outline"
        >
          <Link href={ticketEditPath(slug)} prefetch>
            <LucidePencil className="h-4 w-4" />
            <span className="md:inline">Edit</span>
          </Link>
        </Button>
      )}
      {canUpdateTicket && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex-1 md:flex-none"
              onClick={(e) => e.stopPropagation()}
              size="sm"
              variant="outline"
            >
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              onValueChange={handleStatusChange}
              value={status}
            >
              {(Object.keys(TICKET_STATUS_LABELS) as TicketStatus[]).map(
                (state) => (
                  <DropdownMenuRadioItem key={state} value={state}>
                    {TICKET_STATUS_LABELS[state]}
                  </DropdownMenuRadioItem>
                ),
              )}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {canDeleteTicket && (
        <ConfirmDialog action={deleteTicket.bind(null, id)}>
          <ConfirmDialog.Trigger>
            <Button
              className="flex-1 xs:flex-none"
              onClick={(e) => e.stopPropagation()}
              size="sm"
              variant="destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="xs:inline">Delete</span>
            </Button>
          </ConfirmDialog.Trigger>
        </ConfirmDialog>
      )}
    </>
  ) : null;

  return (
    <div className="max-content-narrow self-start justify-self-center">
      <TicketCard
        actions={desktopActions}
        mobileActions={mobileActions}
        ticket={ticket}
        variant="list"
      />
    </div>
  );
};

export { TicketListItem };
