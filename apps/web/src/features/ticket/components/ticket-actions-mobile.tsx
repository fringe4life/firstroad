"use client";

import type { TicketStatus } from "@firstroad/db/client-types";
import { LucidePencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
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
import { updateStatus } from "@/features/ticket/actions/update-status";
import { TICKET_STATUS_LABELS } from "@/features/ticket/constants";
import type { TicketAccess } from "@/features/ticket/types";
import { ticketEditPath } from "@/path";

interface TicketActionsMobileProps extends TicketAccess {
  ticket: { slug: string; id: string; status: string };
  /** Callback to stop propagation when used inside a clickable card (e.g. list item). */
  onActionClick?: (e: React.MouseEvent) => void;
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

  const handleStatusChange = async (value: string) => {
    const promise = updateStatus(value as TicketStatus, ticket.id);
    toast.promise(promise, { loading: "Updating status" });
    const result = await promise;
    if (result.status === "ERROR") {
      toast.error(result.message);
    } else if (result.status === "SUCCESS") {
      toast.success(result.message);
    }
  };

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
              onValueChange={handleStatusChange}
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
