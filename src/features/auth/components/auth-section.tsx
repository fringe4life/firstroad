import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getSession } from "@/features/auth/queries/get-session";
import { signInPath, signUpPath } from "@/path";
import AccountDropdown from "./account-dropwdown";

// Cached static shell for non-logged-in users
// biome-ignore lint/suspicious/useAwait: needed for use cache
const AuthSectionShell = async () => {
  "use cache";
  cacheLife("weeks");

  return (
    <div className="pt-4">
      <Separator />
      <div className="flex flex-col gap-2 px-3 py-2">
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={signUpPath}
        >
          Sign Up
        </Link>
        <Link
          className={buttonVariants({ variant: "default" })}
          href={signInPath}
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

const AuthSectionContent = async () => {
  const session = await getSession();
  const user = session?.user ?? null;

  if (user) {
    return (
      <div className="pt-4">
        <Separator />
        <div className="px-3 py-2">
          <AccountDropdown user={user} />
        </div>
      </div>
    );
  }

  return <AuthSectionShell />;
};

const AuthSection = () => (
  <Suspense
    fallback={
      <div className="pt-4">
        <Separator />
      </div>
    }
  >
    <AuthSectionContent />
  </Suspense>
);

export default AuthSection;
