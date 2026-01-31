"use client";
import {
  LucideArrowUpRightFromSquare,
  LucideLogOut,
  LucidePen,
  LucideTrash,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type MouseEventHandler, useTransition } from "react";
import { toast } from "sonner";
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
import { authClient } from "@/lib/auth-client";
import { membershipsPath, organisationsPath } from "@/path";
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
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { isOpen, close, open } = useToggle(false);

  const handleLeave: MouseEventHandler<HTMLButtonElement> = () => {
    startTransition(async () => {
      const { error } = await authClient.organization.leave({
        organizationId,
      });
      if (error) {
        // Check if it's the "last member" error
        const errorMessage =
          error.message?.includes("last member") ||
          error.message?.includes("Cannot remove")
            ? "Cannot leave as the last member of an organization"
            : "Failed to leave organization";
        toast.error(errorMessage);
        return;
      }
      toast.success("Left organization successfully");
      // Redirect to organizations list - if user has no orgs, they'll be redirected to onboarding by auth checks
      router.push(organisationsPath());
    });
  };

  const handleDelete: MouseEventHandler<HTMLButtonElement> = () => {
    startTransition(async () => {
      const { error } = await authClient.organization.delete({
        organizationId,
      });
      if (error) {
        toast.error("Failed to delete organization");
        return;
      }

      toast.success("Organization deleted");
      router.refresh();
    });
  };

  let handleDeleteButton: React.ReactNode = (
    <Button size="icon" variant="ghost" />
  );
  let leaveButton: React.ReactNode = <Button size="icon" variant="ghost" />;
  let openButton: React.ReactNode = <Button size="icon" variant="ghost" />;
  let editButton: React.ReactNode = <Button size="icon" variant="ghost" />;

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
            onSuccess={() => {
              close();
              router.refresh();
            }}
            organizationId={organizationId}
            organizationName={organizationName}
            updateOrganisationAction={updateOrganisation}
          />
        </DialogContent>
      </Dialog>
    );
    handleDeleteButton = (
      <Button onClick={handleDelete} size="icon" variant="destructive">
        <LucideTrash className="aspect-square w-4" />
      </Button>
    );
  }

  // Leave button remain visible to all members (when !limitedAccess)
  if (!limitedAccess) {
    leaveButton = (
      <Button onClick={handleLeave} size="icon" variant="destructive">
        <LucideLogOut className="aspect-square w-4" />
      </Button>
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
