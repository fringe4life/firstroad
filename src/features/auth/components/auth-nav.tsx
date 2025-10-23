import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getSession } from "@/features/auth/queries/get-session";
import { signInPath, signUpPath } from "@/path";
import AccountDropdown from "./account-dropwdown";

const AuthNav = async () => {
  const session = await getSession();
  const user = session?.user ?? null;

  if (user) {
    return <AccountDropdown user={user} />;
  }

  return (
    <>
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
    </>
  );
};

export default AuthNav;
