import { RedirectToast } from "@/components/redirect-toast";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  // await connection();
  // const { user, hasUser } = await getUser();

  // if (!hasUser) {
  //   redirect(signInPath());
  // }

  return (
    // <AuthLayoutClient hasActiveOrg={!!user?.activeOrganizationId}>
    <>
      {children}
      <RedirectToast />
    </>
    // </AuthLayoutClient>
  );
};

export default AuthLayout;
