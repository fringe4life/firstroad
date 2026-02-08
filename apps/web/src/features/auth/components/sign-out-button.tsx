"use client";

import { LucideLogOut } from "lucide-react";
import { unstable_rethrow, useRouter } from "next/navigation";
import { useActionState, useTransition } from "react";
import { homePath } from "@/path";
import { tryCatch } from "@/utils/try-catch";
import { signOut } from "../actions/signout";

interface SignOutButtonProps {
  className?: string;
}

const SignOutButton = ({ className }: SignOutButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [, action] = useActionState(signOut, null);

  return (
    <button
      className={className}
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const { error } = await tryCatch(async () => await action());
          if (error) {
            unstable_rethrow(error);
          }
          router.replace(homePath());
        });
      }}
      type="button"
    >
      <LucideLogOut className="mr-2 aspect-square h-4" />
      {isPending ? "Signing Out..." : "Sign Out"}
    </button>
  );
};

export { SignOutButton };
