import type { Route } from "next";

const homePath = (): Route => "/";

const ticketsPath = (): Route => "/tickets";

const ticketPath = (slug: string): Route => `${ticketsPath()}/${slug}` as Route;

const ticketsByOrganisationPath = (): Route => "/tickets/organisation";

const ticketEditPath = (slug: string): Route =>
  `${ticketPath(slug)}/edit` as Route;

const signInPath = (): Route => "/sign-in";
const signUpPath = (): Route => "/sign-up";
const forgotPasswordPath = (): Route => "/forgot-password";
const resetPasswordPath = (token: string): Route =>
  `/reset-password/${token}` as Route;

const verifyEmailOTPSendPath = (): Route => "/verify-email/otp/send";
const verifyEmailOTPVerifyPath = (): Route => "/verify-email/otp/verify";

const signInOTPSendPath = (): Route => "/sign-in/otp/send";
const signInOTPVerifyPath = (): Route => "/sign-in/otp/verify";

const accountProfilePath = (): Route => "/account/profile";
const accountPasswordPath = (): Route => "/account/password";
const signOutPath = (): Route => "/sign-out";

const organisationsPath = (): Route => "/organisations";

const organisationPath = (id: string): Route =>
  `${organisationsPath()}/${id}` as Route;

const organisationsCreatePath = (): Route => "/organisations/create";

const membershipsPath = (id: string): Route =>
  `${organisationPath(id)}/memberships` as Route;

const invitationsPath = (id: string): Route =>
  `${organisationsPath()}/${id}/invitations` as Route;

const acceptInvitationPath = (invitationId: string): Route =>
  `/accept-invitation/${invitationId}` as Route;

const onboardingPath = (): Route => "/onboarding";
const selectActiveOrganisationPath = (): Route =>
  `${onboardingPath()}/select-active-organisation` as Route;

export {
  acceptInvitationPath,
  accountPasswordPath,
  accountProfilePath,
  forgotPasswordPath,
  homePath,
  invitationsPath,
  membershipsPath,
  onboardingPath,
  organisationPath,
  organisationsPath,
  resetPasswordPath,
  selectActiveOrganisationPath,
  signInOTPSendPath,
  signInOTPVerifyPath,
  organisationsCreatePath,
  signInPath,
  signOutPath,
  signUpPath,
  ticketEditPath,
  ticketPath,
  ticketsByOrganisationPath,
  ticketsPath,
  verifyEmailOTPSendPath,
  verifyEmailOTPVerifyPath,
};
