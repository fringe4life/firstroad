"use client";
import {
  LucideArrowUpRightFromSquare,
  LucideLogOut,
  LucidePen,
  LucideTrash,
} from "lucide-react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/confirm-dialog/index";
import { PendingIconButton } from "@/components/pending-icon-button";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToggle } from "@/hooks/use-toggle";
import { membershipsPath } from "@/path";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { deleteOrganisation } from "../actions/delete-organisation";
import { leaveOrganisation } from "../actions/leave-organisation";
import { updateOrganisation } from "../actions/update-organisation";
import type { OrganisationActionButtonProps } from "../types";
import { SwitchOrgButton } from "./switch-org-button";
import { UpdateOrganisationForm } from "./update-organisation-form";

const OrganisationActionButtons = ({
  organizationId,
  organizationName,
  isActive,
  isAdminOrOwner,
  limitedAccess,
}: OrganisationActionButtonProps) => {
  const { isOpen, close, open } = useToggle(false);

  let handleDeleteButton: React.ReactNode = (
    <Button disabled size="icon" variant="ghost" />
  );
  let leaveButton: React.ReactNode = (
    <Button disabled size="icon" variant="ghost" />
  );
  let openButton: React.ReactNode = (
    <Button disabled size="icon" variant="ghost" />
  );
  let editButton: React.ReactNode = (
    <Button disabled size="icon" variant="ghost" />
  );

  // Show open, edit and delete buttons only if not limited access AND user is admin/owner
  if (!limitedAccess && isAdminOrOwner) {
    openButton = (
      <Link
        className={buttonVariants({ variant: "outline", size: "icon" })}
        href={membershipsPath(organizationId)}
      >
        <LucideArrowUpRightFromSquare className="aspect-square w-4" />
      </Link>
    );

    editButton = (
      <Dialog onOpenChange={open} open={isOpen}>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline">
            <LucidePen className="aspect-square w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename organisation</DialogTitle>
            <DialogDescription>
              Update the organisation name for your team.
            </DialogDescription>
          </DialogHeader>
          <UpdateOrganisationForm
            key={`${organizationId}-${organizationName}`}
            onSuccess={close}
            organizationId={organizationId}
            organizationName={organizationName}
            updateOrganisationAction={updateOrganisation}
          />
        </DialogContent>
      </Dialog>
    );
    handleDeleteButton = (
      <ConfirmDialog
        action={(prevState) =>
          deleteOrganisation(organizationId, prevState ?? EMPTY_ACTION_STATE)
        }
        closeOnSubmit
        description="This will permanently delete the organisation and all its data. This action cannot be undone."
        title="Delete organisation"
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
  }

  // Leave button remain visible to all members (when !limitedAccess)
  if (!limitedAccess) {
    leaveButton = (
      <ConfirmDialog
        action={(prevState) =>
          leaveOrganisation(organizationId, prevState ?? EMPTY_ACTION_STATE)
        }
        closeOnSubmit
        description="You will lose access to this organisation. You can rejoin only if invited again."
        title="Leave organisation"
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
    );
  }

  return (
    <div className="flex justify-end gap-x-2">
      <SwitchOrgButton isActive={isActive} organizationId={organizationId} />
      {openButton}
      {editButton}
      {leaveButton}
      {handleDeleteButton}
    </div>
  );
};

export { OrganisationActionButtons };
