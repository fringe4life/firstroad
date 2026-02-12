"use client";
import type { TicketStatus } from "@firstroad/db/client-types";
import { LucideTrash } from "lucide-react";
import { toast } from "sonner";
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
import { updateStatus } from "@/features/ticket/actions/update-status";
import { TICKET_STATUS_LABELS } from "@/features/ticket/constants";
import type { TicketMoreMenuProps } from "@/features/ticket/types";

const TicketMoreMenu = ({
  ticket,
  trigger,
  canDeleteTicket = true,
  canUpdateTicket = true,
}: TicketMoreMenuProps) => {
  const handleValueChange = async (value: string) => {
    const promise = updateStatus(value as TicketStatus, ticket.id);

    toast.promise(promise, {
      loading: " Updating status",
    });

    const result = await promise;

    if (result.status === "ERROR") {
      toast.error(result.message);
    } else if (result.status === "SUCCESS") {
      toast.success(result.message);
    }
  };

  const radioOptions = (
    <DropdownMenuRadioGroup
      onValueChange={handleValueChange}
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
        {canUpdateTicket && radioOptions}

        {canDeleteTicket && (
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
