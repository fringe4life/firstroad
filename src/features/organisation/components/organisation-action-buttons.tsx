"use client";
import {
  LucideArrowLeftRight,
  LucideArrowUpRightFromSquare,
  LucidePen,
  LucideTrash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const OrganisationActionButtons = ({
  organizationId,
  isActive,
}: {
  organizationId: string;
  isActive: boolean;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSetActive = () => {
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
      <Button
        onClick={() => console.log("click")}
        size="icon"
        variant="outline"
      >
        <LucideArrowUpRightFromSquare className="aspect-square w-4" />
      </Button>
      <Button
        onClick={() => console.log("click")}
        size="icon"
        variant="outline"
      >
        <LucidePen className="aspect-square w-4" />
      </Button>
      <Button
        onClick={() => console.log("click")}
        size="icon"
        variant="destructive"
      >
        <LucideTrash className="aspect-square w-4" />
      </Button>
    </div>
  );
};

export { OrganisationActionButtons };
