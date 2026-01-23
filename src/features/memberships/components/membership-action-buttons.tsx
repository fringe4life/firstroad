"use client";
import { LucidePen, LucideTrash } from "lucide-react";
import { useRouter } from "next/navigation";
import { type MouseEventHandler, startTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const MembershipActionButtons = ({
  organisationId,
  userId,
}: {
  organisationId: string;
  userId: string;
}) => {
  const router = useRouter();

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

  // Show edit/delete buttons for members
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
