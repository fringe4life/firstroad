import type { Route } from "next";

const homePath = (): Route => "/";

const ticketsPath = (): Route => "/tickets";

const ticketPath = (slug: string): Route => `${ticketsPath()}/${slug}` as Route;

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

const onboardingPath = (): Route => "/onboarding";
const selectActiveOrganisationPath = (): Route =>
  `${onboardingPath()}/select-active-organisation` as Route;

export {
  onboardingPath,
  selectActiveOrganisationPath,
  homePath,
  ticketsPath,
  forgotPasswordPath,
  resetPasswordPath,
  verifyEmailOTPSendPath,
  verifyEmailOTPVerifyPath,
  signInPath,
  signInOTPSendPath,
  signInOTPVerifyPath,
  signOutPath,
  signUpPath,
  ticketEditPath,
  ticketPath,
  accountProfilePath,
  accountPasswordPath,
  organisationsPath,
};
