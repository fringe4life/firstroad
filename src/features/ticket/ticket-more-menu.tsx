"use client";

import { LucideTrash } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteTicket } from "@/features/actions/delete-ticket";
import { updateStatus } from "@/features/actions/update-status";
import { TICKET_STATUS_LABELS } from "@/features/constants";
import { Ticket, TicketStatus } from "@/generated/prisma";
import useConfirmDialog from "../../components/confirm-dialog";
type TicketMoreMenuProps = {
  ticket: Ticket;
  trigger: React.ReactNode;
};

const TicketMoreMenu = ({ ticket, trigger }: TicketMoreMenuProps) => {
  // const deleteButton = <ConfirmDialog action={} trigger={} />;

  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteTicket.bind(null, ticket.id),
    trigger: (
      <DropdownMenuItem className="flex justify-between px-4">
        <LucideTrash className="size-4" />
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
      {(Object.keys(TICKET_STATUS_LABELS) as Array<TicketStatus>).map(
        (state) => (
          <DropdownMenuRadioItem key={state} value={state}>
            {TICKET_STATUS_LABELS[state]}
          </DropdownMenuRadioItem>
        )
      )}
    </DropdownMenuRadioGroup>
  );

  return (
    <>
      {deleteDialog}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" side="left">
          {radioOptions}

          {deleteButton}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default TicketMoreMenu;
