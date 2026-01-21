import { LucidePen, LucideTrash } from "lucide-react";
import { useRouter } from "next/navigation";
import { type MouseEventHandler, startTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const MembershipActionButtons = ({
  organizationId,
  userId,
}: {
  organizationId: string;
  userId: string;
}) => {
  const router = useRouter();
  const handleDelete: MouseEventHandler<HTMLButtonElement> = () => {
    startTransition(async () => {
      const { error } = await authClient.organization.removeMember({
        organizationId,
        memberIdOrEmail: userId,
      });
      if (error) {
        toast.error("Failed to delete membership");
        return;
      }
      toast.success("Membership deleted");
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
      <Button onClick={handleDelete} size="icon" variant="outline">
        <LucideTrash className="aspect-square w-4" />
      </Button>
    </div>
  );
};

export { MembershipActionButtons };
