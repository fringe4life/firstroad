import { redirect } from "next/navigation";
import { getUser } from "@/features/auth/queries/get-user";
import { signInPath } from "@/path";
import { AuthLayoutClient } from "./auth-layout-client";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const { user, hasUser } = await getUser();

  if (!hasUser) {
    redirect(signInPath());
  }

  return (
    <AuthLayoutClient hasActiveOrg={!!user?.activeOrganizationId}>
      {children}
    </AuthLayoutClient>
  );
};

export default AuthLayout;
