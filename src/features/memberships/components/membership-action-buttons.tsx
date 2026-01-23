"use client";
import { LucideLogOut, LucidePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { type MouseEventHandler, startTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const MembershipActionButtons = ({
  currentUserEmail,
  memberEmail,
  organisationId,
  userId,
}: {
  currentUserEmail?: string | null;
  memberEmail: string;
  organisationId: string;
  userId: string;
}) => {
  const router = useRouter();
  const isCurrentUser = memberEmail === currentUserEmail;
  // Since this page is only accessible by admin/owner, we can show remove button
  const canRemoveMember = !isCurrentUser;

  const handleRemoveMember: MouseEventHandler<HTMLButtonElement> = () => {
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
            : "Failed to remove member";
        toast.error(errorMessage);
        return;
      }
      toast.success("Member removed successfully");
      router.refresh();
    });
  };

  const handleEdit: MouseEventHandler<HTMLButtonElement> = () => {
    console.log("edit");
  };

  return (
    <div className="flex justify-end gap-x-2">
      <Button onClick={handleEdit} size="icon" variant="outline">
        <LucidePen className="aspect-square w-4" />
      </Button>
      {canRemoveMember && (
        <Button onClick={handleRemoveMember} size="icon" variant="destructive">
          <LucideLogOut className="aspect-square w-4" />
        </Button>
      )}
    </div>
  );
};

export { MembershipActionButtons };
