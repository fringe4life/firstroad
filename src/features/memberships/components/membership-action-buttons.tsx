"use client";
import { LucideLogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { type MouseEventHandler, startTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { MemberRole } from "@/generated/prisma/enums";
import { authClient } from "@/lib/auth-client";
import { MembershipsMoreMenu } from "./memberships-more-menu";

const MembershipActionButtons = ({
  currentUserEmail,
  memberEmail,
  organisationId,
  memberId,
  role,
}: {
  currentUserEmail?: string | null;
  memberEmail: string;
  organisationId: string;
  memberId: string;
  role: MemberRole;
}) => {
  const router = useRouter();
  const isCurrentUser = memberEmail === currentUserEmail;
  // Since this page is only accessible by admin/owner, we can show remove button
  const canRemoveMember = !isCurrentUser;

  const handleRemoveMember: MouseEventHandler<HTMLButtonElement> = () => {
    startTransition(async () => {
      const { error } = await authClient.organization.removeMember({
        organizationId: organisationId,
        memberIdOrEmail: memberId,
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

  let canRemoveMemberButton: React.ReactNode = null;
  if (canRemoveMember) {
    canRemoveMemberButton = (
      <Button onClick={handleRemoveMember} size="icon" variant="destructive">
        <LucideLogOut className="aspect-square w-4" />
      </Button>
    );
  }

  return (
    <div className="flex justify-end gap-x-2">
      <MembershipsMoreMenu
        memberId={memberId}
        organisationId={organisationId}
        role={role}
      />
      {canRemoveMemberButton}
    </div>
  );
};

export { MembershipActionButtons };
