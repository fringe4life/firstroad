"use client";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { type MouseEventHandler, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { ticketsPath } from "@/path";

const GithubLoginButton = () => {
  const [isPending, startTransition] = useTransition();
  const handleGithubLogin: MouseEventHandler<HTMLButtonElement> = () => {
    startTransition(
      async () =>
        //  @ts-expect-error promise
        await authClient.signIn.social({
          callbackURL: ticketsPath(),
          provider: "github",
        }),
    );
  };
  return (
    <Button
      disabled={isPending}
      onClick={handleGithubLogin}
      size="lg"
      variant="outline"
    >
      <SiGithub aria-hidden className="aspect-square w-4" title="" />{" "}
      {isPending ? "Signing in..." : "Login with Github"}
    </Button>
  );
};

export { GithubLoginButton };
