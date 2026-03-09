import type { TicketStatus } from "@firstroad/db/client-types";
import { startTransition } from "react";
import { toast } from "sonner";
import { updateStatus } from "@/features/ticket/actions/update-status";

export const statusChangeWithToast = (
  ticketId: string,
  value: string,
): void => {
  startTransition(() => {
    const promise = updateStatus(value as TicketStatus, ticketId);
    toast.promise(promise, { loading: "Updating status" });
    promise.then((result) => {
      if (result.status === "ERROR") {
        toast.error(result.message);
      } else if (result.status === "SUCCESS") {
        toast.success(result.message);
      }
    });
  });
};
