"use client";
import { toast } from "sonner";
import { ConfirmDeleteIcon } from "@/components/confirm-delete-icon";
import { useConfirmDialog } from "@/components/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TICKET_STATUS_LABELS } from "@/features/constants";
import { deleteTicket } from "@/features/ticket/actions/delete-ticket";
import { updateStatus } from "@/features/ticket/actions/update-status";
import type { TicketMoreMenuProps } from "@/features/ticket/types";
import type { TicketStatus } from "@/generated/prisma/enums";

const TicketMoreMenu = ({
  ticket,
  trigger,
  canDeleteTicket = true,
  canUpdateTicket = true,
}: TicketMoreMenuProps) => {
  const [getDeleteButton, deleteDialog, isPending] = useConfirmDialog({
    action: deleteTicket.bind(null, ticket.id),
    trigger: ({ isPending: isPendingArg, onClick }) => (
      <DropdownMenuItem
        className="flex justify-between px-4"
        disabled={isPendingArg}
        onClick={onClick}
      >
        <ConfirmDeleteIcon isPending={isPendingArg} />
        <span>Delete</span>
      </DropdownMenuItem>
    ),
  });

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
    <>
      {canDeleteTicket && deleteDialog}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" side="left">
          {canUpdateTicket && radioOptions}

          {canDeleteTicket && getDeleteButton(isPending)}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export { TicketMoreMenu };
