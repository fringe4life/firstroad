import { ShieldX } from "lucide-react";
import type { Route } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import Placeholder from "@/components/placeholder";
import { buttonVariants } from "@/components/ui/button";
import { signInPath } from "@/path";

const UnauthorizedEdit = async () => {
  const headersList = await headers();
  const pathname =
    headersList.get("x-pathname") || headersList.get("x-invoke-path");

  // Build sign-in URL with callback to return here after login
  const signInWithCallback = (
    pathname
      ? `${signInPath}?callbackUrl=${encodeURIComponent(pathname)}`
      : signInPath
  ) as Route;

  return (
    <Placeholder
      button={
        <Link
          className={buttonVariants({ variant: "default" })}
          href={signInWithCallback}
        >
          Sign in with different account
        </Link>
      }
      icon={<ShieldX />}
      label="You are not authorized to edit this ticket."
    />
  );
};

export default UnauthorizedEdit;
