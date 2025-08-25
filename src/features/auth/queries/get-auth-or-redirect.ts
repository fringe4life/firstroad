import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import { signInPath } from "@/path";

export async function getAuthOrRedirect() {
  console.log("🔍 getAuthOrRedirect - Starting authentication check");

  const session = await auth();
  console.log("🔍 getAuthOrRedirect - Session result:", {
    hasSession: !!session,
    hasUser: !!session?.user,
    hasUserId: !!session?.user?.id,
    userId: session?.user?.id,
    userEmail: session?.user?.email,
  });

  if (!session?.user?.id) {
    console.log(
      "❌ getAuthOrRedirect - No valid session, redirecting to sign-in",
    );
    console.log("🎯 Redirect target:", signInPath);
    redirect(signInPath);
  }
  console.log("✅ getAuthOrRedirect - Authentication successful");
  return session;
}
