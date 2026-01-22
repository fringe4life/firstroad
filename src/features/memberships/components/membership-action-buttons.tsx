"use client";
import { LucideLogOut, LucidePen, LucideTrash } from "lucide-react";
import { useRouter } from "next/navigation";
import { type MouseEventHandler, startTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { organisationsPath } from "@/path";

const MembershipActionButtons = ({
  isCurrentUser,
  organisationId,
  userId,
}: {
  isCurrentUser: boolean;
  organisationId: string;
  userId: string;
}) => {
  const router = useRouter();

  const handleLeave: MouseEventHandler<HTMLButtonElement> = () => {
    startTransition(async () => {
      const { error } = await authClient.organization.leave({
        organizationId: organisationId,
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
      const { error } = await authClient.organization.removeMember({
        organizationId: organisationId,
        memberIdOrEmail: userId,
      });
      if (error) {
        // Check if it's the "last member" error
        const errorMessage =
          error.message?.includes("last member") ||
          error.message?.includes("Cannot remove")
            ? "Cannot remove the last member from an organization"
            : "Failed to delete membership";
        toast.error(errorMessage);
        return;
      }
      toast.success("Membership deleted");
      router.refresh();
    });
  };

  const handleEdit: MouseEventHandler<HTMLButtonElement> = () => {
    console.log("edit");
  };

  // If current user, show leave button
  if (isCurrentUser) {
    return (
      <div className="flex justify-end gap-x-2">
        <Button onClick={handleLeave} size="icon" variant="destructive">
          <LucideLogOut className="aspect-square w-4" />
        </Button>
      </div>
    );
  }

  // Otherwise, show edit/delete buttons for other members
  return (
    <div className="flex justify-end gap-x-2">
      <Button onClick={handleEdit} size="icon" variant="outline">
        <LucidePen className="aspect-square w-4" />
      </Button>
      <Button onClick={handleDelete} size="icon" variant="destructive">
        <LucideTrash className="aspect-square w-4" />
      </Button>
    </div>
  );
};

export { MembershipActionButtons };
