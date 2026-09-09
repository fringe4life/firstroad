"use client";

import { LucideLogOut } from "lucide-react";
import { unstable_rethrow, useRouter } from "next/navigation";
import { useActionState, useTransition } from "react";
import { homePath } from "@/path";
import { tryCatch } from "@/utils/try-catch";
import { signOut } from "../actions/signout";

interface SignOutButtonProps extends React.ComponentProps<"button"> {
  className?: string;
}

const SignOutButton = ({
  className,
  onClick,
  disabled,
  type = "button",
  ...props
}: SignOutButtonProps) => {
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [, action] = useActionState(signOut, null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) {
      return;
    }

    startTransition(async () => {
      const { error } = await tryCatch(async () => await action());
      if (error) {
        unstable_rethrow(error);
      }
      replace(homePath());
    });
  };

  return (
    <button
      className={className}
      disabled={disabled ?? isPending}
      type={type}
      {...props}
      onClick={handleClick}
    >
      <LucideLogOut className="mr-2 aspect-square h-4" />
      {isPending ? "Signing Out..." : "Sign Out"}
    </button>
  );
};

export { SignOutButton };
