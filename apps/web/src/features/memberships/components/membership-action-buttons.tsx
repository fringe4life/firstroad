"use client";
import type { MemberRole } from "@firstroad/db/client-types";
import { LucideLogOut } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog/index";
import { PendingIconButton } from "@/components/pending-icon-button";
import { Button } from "@/components/ui/button";
import { type ActionState, EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { removeMember } from "../actions/remove-member";
import { MembershipsMoreMenu } from "./memberships-more-menu";

const MembershipActionButtons = ({
  currentUserEmail,
  memberEmail,
  organizationId,
  memberId,
  role,
}: {
  currentUserEmail?: string | null;
  memberEmail: string;
  organizationId: string;
  memberId: string;
  role: MemberRole;
}) => {
  const isCurrentUser = memberEmail === currentUserEmail;
  // Since this page is only accessible by admin/owner, we can show remove button
  const canRemoveMember = !isCurrentUser;

  return (
    <div className="flex justify-end gap-x-2">
      <MembershipsMoreMenu
        memberId={memberId}
        organizationId={organizationId}
        role={role}
      />
      {canRemoveMember ? (
        <ConfirmDialog
          action={(prevState) =>
            removeMember(
              organizationId,
              memberId,
              (prevState ?? EMPTY_ACTION_STATE) as ActionState<null>,
            )
          }
          closeOnSubmit
          description="This member will lose access to the organisation. They can rejoin only if invited again."
          title="Remove member"
        >
          {({ isPending }) => (
            <ConfirmDialog.Trigger>
              <PendingIconButton
                disabled={isPending}
                icon={<LucideLogOut />}
                size="icon"
                variant="destructive"
              />
            </ConfirmDialog.Trigger>
          )}
        </ConfirmDialog>
      ) : (
        <Button disabled size="icon" variant="ghost" />
      )}
    </div>
  );
};

export { MembershipActionButtons };
