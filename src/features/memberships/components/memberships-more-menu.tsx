"use client";
import { LucideUserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberRole } from "@/generated/prisma/enums";
import { authClient } from "@/lib/auth-client";
import type { MembershipsMoreMenuProps } from "../types";

const MembershipsMoreMenu = ({
  organizationId,
  memberId,
  role,
}: MembershipsMoreMenuProps) => {
  const router = useRouter();
  const isOwner = role === MemberRole.owner;
  const handleRoleChange = (nextRole: string) => {
    if (nextRole === role) {
      return;
    }
    startTransition(async () => {
      const { error } = await authClient.organization.updateMemberRole({
        organizationId,
        memberId,
        role: nextRole,
      });
      if (error) {
        toast.error(error.message || "Failed to update member role");
        return;
      }
      toast.success("Member role updated");
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <LucideUserCog className="aspect-square w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup onValueChange={handleRoleChange} value={role}>
          <DropdownMenuRadioItem disabled={isOwner} value={MemberRole.admin}>
            Admin
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem disabled={isOwner} value={MemberRole.member}>
            Member
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { MembershipsMoreMenu };
