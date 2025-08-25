"use client";

import type { Ticket, TicketStatus } from "@prisma/client";
import { LucideLoaderCircle, LucideTrash } from "lucide-react";
import { toast } from "sonner";
import useConfirmDialog from "@/components/confirm-dialog";
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

type TicketMoreMenuProps = {
  ticket: Ticket;
  trigger: React.ReactNode;
};

const TicketMoreMenu = ({ ticket, trigger }: TicketMoreMenuProps) => {
  // const deleteButton = <ConfirmDialog action={} trigger={} />;

  const [getDeleteButton, deleteDialog, isPending] = useConfirmDialog({
    action: deleteTicket.bind(null, ticket.id),
    trigger: (isPending: boolean) => (
      <DropdownMenuItem
        className="flex justify-between px-4"
        disabled={isPending}
      >
        {isPending ? (
          <LucideLoaderCircle className="aspect-square w-4 animate-spin" />
        ) : (
          <LucideTrash className="aspect-square w-4" />
        )}
        <span>Delete</span>
      </DropdownMenuItem>
    ),
  });

  const handleValueChange = async (value: string) => {
    console.log(value);
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
      value={ticket.status}
      onValueChange={handleValueChange}
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
      {deleteDialog}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" side="left">
          {radioOptions}

          {getDeleteButton(isPending)}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default TicketMoreMenu;
