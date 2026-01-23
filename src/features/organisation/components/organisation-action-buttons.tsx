"use client";
import {
  LucideArrowLeftRight,
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
import { authClient } from "@/lib/auth-client";
import { membershipsPath, organisationsPath } from "@/path";
import type { OrganisationActionButtonProps } from "../types";

const OrganisationActionButtons = ({
  organizationId,
  isActive,
  limitedAccess,
}: OrganisationActionButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSetActive: MouseEventHandler<HTMLButtonElement> = () => {
    startTransition(async () => {
      const { error } = await authClient.organization.setActive({
        organizationId,
      });

      if (error) {
        toast.error("Failed to switch organization");
        return;
      }

      toast.success("Organization switched");
      router.refresh(); // Refresh server components to get updated session
    });
  };

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

  let handleDeleteButton: React.ReactNode = null;
  let leaveButton: React.ReactNode = null;
  let openButton: React.ReactNode = null;
  let editButton: React.ReactNode = null;

  if (!limitedAccess) {
    openButton = (
      <Link
        className={buttonVariants({ variant: "outline", size: "icon" })}
        href={membershipsPath(organizationId)}
      >
        <LucideArrowUpRightFromSquare className="aspect-square w-4" />
      </Link>
    );

    editButton = (
      <Button
        onClick={() => console.log("click")}
        size="icon"
        variant="outline"
      >
        <LucidePen className="aspect-square w-4" />
      </Button>
    );

    leaveButton = (
      <Button onClick={handleLeave} size="icon" variant="destructive">
        <LucideLogOut className="aspect-square w-4" />
      </Button>
    );

    handleDeleteButton = (
      <Button onClick={handleDelete} size="icon" variant="destructive">
        <LucideTrash className="aspect-square w-4" />
      </Button>
    );
  }

  return (
    <div className="flex justify-end gap-x-2">
      <Button
        disabled={isActive || isPending}
        onClick={handleSetActive}
        size="icon"
        title={
          isActive
            ? "Current active organization"
            : "Switch to this organization"
        }
        variant="outline"
      >
        <LucideArrowLeftRight className="aspect-square w-4" />
      </Button>
      {openButton}
      {editButton}
      {leaveButton}
      {handleDeleteButton}
    </div>
  );
};

export { OrganisationActionButtons };
