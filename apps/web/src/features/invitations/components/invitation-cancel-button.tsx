"use client";

import { ConfirmDeleteIcon } from "@/components/confirm-delete-icon";
import { ConfirmDialog } from "@/components/confirm-dialog/index";
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
  return (
    <ConfirmDialog
      action={() => cancelInvitation(organizationId, invitationId)}
      closeOnSubmit
      description="Are you sure you want to cancel this invitation? The invitee will no longer be able to join using this invitation."
      title="Cancel invitation"
    >
      {({ isPending }) => (
        <ConfirmDialog.Trigger>
          <Button size="icon" variant="outline">
            <ConfirmDeleteIcon isPending={isPending} />
          </Button>
        </ConfirmDialog.Trigger>
      )}
    </ConfirmDialog>
  );
};

export { InvitationCancelButton };
