"use client";
import { LucideGithub } from "lucide-react";
import { type MouseEventHandler, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const GithubLoginButton = () => {
  const [isPending, startTransition] = useTransition();
  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    startTransition(
      async () =>
        //  @ts-expect-error promise
        await authClient.signIn.social({
          provider: "github",
        }),
    );
  };
  return (
    <Button
      disabled={isPending}
      onClick={handleClick}
      size="lg"
      variant="outline"
    >
      <LucideGithub className="aspect-square w-4" />{" "}
      {isPending ? "Signing in..." : "Login with Github"}
    </Button>
  );
};

export { GithubLoginButton };
