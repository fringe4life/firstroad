import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { homePath } from "@/path";

const SignOutPage = async () => {
  // Sign out the user
  await auth.api.signOut({
    headers: await headers(),
  });

  // Redirect to home page
  throw redirect(homePath);
};

export default SignOutPage;
