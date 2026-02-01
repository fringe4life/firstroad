"use client";

import { ConfirmDeleteIcon } from "@/components/confirm-delete-icon";
import { useConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { cancelInvitation } from "../actions/cancel-invitation";

interface InvitationCancelButtonProps {
  organizationId: string;
  invitationId: string;
}

const InvitationCancelButton = ({
  organizationId,
  invitationId,
}: InvitationCancelButtonProps) => {
  const [getCancelButton, cancelDialog, isPending] = useConfirmDialog({
    action: () => cancelInvitation(organizationId, invitationId),
    trigger: ({ isPending: isPendingArg, onClick }) => (
      <Button
        disabled={isPendingArg}
        onClick={onClick}
        size="icon"
        variant="outline"
      >
        <ConfirmDeleteIcon isPending={isPendingArg} />
      </Button>
    ),
    title: "Cancel invitation",
    description:
      "Are you sure you want to cancel this invitation? The invitee will no longer be able to join using this invitation.",
    closeOnSubmit: true,
  });

  return (
    <>
      {getCancelButton(isPending)}
      {cancelDialog}
    </>
  );
};

export { InvitationCancelButton };
