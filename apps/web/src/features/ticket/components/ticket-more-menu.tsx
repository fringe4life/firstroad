"use client";
import type { TicketStatus } from "@firstroad/db/client-types";
import { LucideTrash } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog/index";
import { PendingIcon } from "@/components/pending-icon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteTicket } from "@/features/ticket/actions/delete-ticket";
import { TICKET_STATUS_LABELS } from "@/features/ticket/constants";
import type { TicketMoreMenuProps } from "@/features/ticket/types";
import { statusChangeWithToast } from "@/features/ticket/utils/status-change-with-toast";

const TicketMoreMenu = ({
  ticket,
  trigger,
  canDelete = true,
  canUpdate = true,
}: TicketMoreMenuProps) => {
  const radioOptions = (
    <DropdownMenuRadioGroup
      onValueChange={statusChangeWithToast.bind(null, ticket.id)}
      value={ticket.status}
    >
      {(Object.keys(TICKET_STATUS_LABELS) as TicketStatus[]).map((state) => (
        <DropdownMenuRadioItem key={state} value={state}>
          {TICKET_STATUS_LABELS[state]}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="left">
        {canUpdate && radioOptions}

        {canDelete && (
          <ConfirmDialog action={deleteTicket.bind(null, ticket.id)}>
            {({ isPending }) => (
              <ConfirmDialog.Trigger>
                <DropdownMenuItem className="flex justify-between px-4">
                  <PendingIcon icon={<LucideTrash />} isPending={isPending} />
                  <span>Delete</span>
                </DropdownMenuItem>
              </ConfirmDialog.Trigger>
            )}
          </ConfirmDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { TicketMoreMenu };
