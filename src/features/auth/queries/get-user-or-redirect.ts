import { redirect } from "next/navigation";
import { getUser } from "@/features/auth/queries/get-user";
import type { User } from "@/features/auth/types";
import { getOrganisationByUser } from "@/features/organisation/queries/get-organisations-for-user";
import { onboardingPath, signInPath, verifyEmailOTPSendPath } from "@/path";

export interface GetUserRedirectOptions {
  checkEmailVerified?: boolean;
  checkOrganistation?: boolean;
  checkActiveOrganisation?: boolean;
}

export const getUserOrRedirect = async (
  options?: GetUserRedirectOptions,
): Promise<User> => {
  const { user, hasUser } = await getUser();

  // default: no-session branch
  if (!hasUser) {
    throw redirect(signInPath());
  }
  const {
    checkEmailVerified = true,
    checkOrganistation = true,
    checkActiveOrganisation = true,
  } = options ?? {};

  const userNeedsEmailVerification = checkEmailVerified && !user.emailVerified;

  if (userNeedsEmailVerification) {
    throw redirect(verifyEmailOTPSendPath());
  }

  if (checkOrganistation) {
    const organisations = await getOrganisationByUser();

    if (!organisations || organisations.length === 0) {
      throw redirect(onboardingPath());
    }
  }

  if (checkActiveOrganisation && !user.activeOrganizationId) {
    // TODO
  }

  return user;
};
