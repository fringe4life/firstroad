import Link from "next/link";
import { Suspense } from "react";
import AccountDropdown from "@/app/_navigation/account-dropwdown";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getSession } from "@/features/auth/queries/get-session";
import { signInPath, signUpPath } from "@/path";

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

const AuthSection = () => {
  return (
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
};

export default AuthSection;
