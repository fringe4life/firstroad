import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { homePath } from "@/path";

// Dynamic sign-out logic
const SignOutLogic = async () => {
  // Sign out the user
  await auth.api.signOut({
    headers: await headers(),
  });

  // Redirect to home page
  throw redirect(homePath);
};

// Loading fallback
const SignOutFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
      <p className="text-muted-foreground">Signing out...</p>
    </div>
  </div>
);

const SignOutPage = () => (
  <Suspense fallback={<SignOutFallback />}>
    <SignOutLogic />
  </Suspense>
);

export default SignOutPage;
