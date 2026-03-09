"use client";

import type { TicketStatus } from "@firstroad/db/client-types";
import { LucidePencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/confirm-dialog/index";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteTicket } from "@/features/ticket/actions/delete-ticket";
import { TICKET_STATUS_LABELS } from "@/features/ticket/constants";
import type { TicketAccess } from "@/features/ticket/types";
import { statusChangeWithToast } from "@/features/ticket/utils/status-change-with-toast";
import { ticketEditPath } from "@/path";

interface TicketActionsMobileProps extends TicketAccess {
  /** Callback to stop propagation when used inside a clickable card (e.g. list item). */
  onActionClick?: (e: React.MouseEvent) => void;
  ticket: { slug: string; id: string; status: string };
}

const TicketActionsMobile = ({
  ticket,
  isOwner,
  canUpdate,
  canDelete,
  onActionClick,
}: TicketActionsMobileProps) => {
  if (!isOwner) {
    return null;
  }

  const clickProps = onActionClick ? { onClick: onActionClick } : undefined;

  return (
    <>
      {canUpdate && (
        <Button
          asChild
          className="flex-1 md:flex-none"
          size="sm"
          variant="outline"
          {...clickProps}
        >
          <Link href={ticketEditPath(ticket.slug)} prefetch>
            <LucidePencil className="h-4 w-4" />
            <span className="md:inline">Edit</span>
          </Link>
        </Button>
      )}
      {canUpdate && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex-1 md:flex-none"
              size="sm"
              variant="outline"
              {...clickProps}
            >
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              onValueChange={statusChangeWithToast.bind(null, ticket.id)}
              value={ticket.status}
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
      {canDelete && (
        <ConfirmDialog action={deleteTicket.bind(null, ticket.id)}>
          <ConfirmDialog.Trigger>
            <Button
              className="flex-1 xs:flex-none"
              size="sm"
              variant="destructive"
              {...clickProps}
            >
              <Trash2 className="h-4 w-4" />
              <span className="xs:inline">Delete</span>
            </Button>
          </ConfirmDialog.Trigger>
        </ConfirmDialog>
      )}
    </>
  );
};

export { TicketActionsMobile };
