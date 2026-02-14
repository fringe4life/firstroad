"use client";

import { LucideTrash } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog/index";
import { PendingIconButton } from "@/components/pending-icon-button";
import { cancelInvitation } from "../actions/cancel-invitation";

interface InvitationCancelButtonProps {
  organizationId: string;
  invitationId: string;
}

const InvitationCancelButton = ({
  organizationId,
  invitationId,
}: InvitationCancelButtonProps) => {
  return (
    <ConfirmDialog
      action={cancelInvitation.bind(null, organizationId, invitationId)}
      closeOnSubmit
      description="Are you sure you want to cancel this invitation? The invitee will no longer be able to join using this invitation."
      title="Cancel invitation"
    >
      {({ isPending }) => (
        <ConfirmDialog.Trigger>
          <PendingIconButton
            disabled={isPending}
            icon={<LucideTrash />}
            size="icon"
            variant="destructive"
          />
        </ConfirmDialog.Trigger>
      )}
    </ConfirmDialog>
  );
};

export { InvitationCancelButton };
