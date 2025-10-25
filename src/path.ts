import type { Route } from "next";

const ticketsPath: Route = "/tickets";

const homePath: Route = "/";

const ticketPath = (ticketId: string): Route =>
  `${ticketsPath}/${ticketId}` as Route;

const ticketEditPath = (ticketId: string): Route =>
  `${ticketPath(ticketId)}/edit` as Route;

const signInPath: Route = "/sign-in";
const signUpPath: Route = "/sign-up";
const forgotPasswordPath: Route = "/forgot-password";
const resetPasswordPath = (token: string): Route =>
  `/reset-password/${token}` as Route;
const verifyEmailPath: Route = "/verify-email";
const verifyEmailOTPSendPath: Route = "/verify-email/otp/send";
const verifyEmailOTPVerifyPath: Route = "/verify-email/otp/verify";

const signInOTPSendPath: Route = "/sign-in/otp/send";
const signInOTPVerifyPath: Route = "/sign-in/otp/verify";

const accountProfilePath: Route = "/account/profile";
const accountPasswordPath: Route = "/account/password";
const signOutPath: Route = "/sign-out";

export {
  homePath,
  forgotPasswordPath,
  resetPasswordPath,
  verifyEmailPath,
  verifyEmailOTPSendPath,
  verifyEmailOTPVerifyPath,
  signInPath,
  signInOTPSendPath,
  signInOTPVerifyPath,
  signOutPath,
  signUpPath,
  ticketEditPath,
  ticketPath,
  ticketsPath,
  accountProfilePath,
  accountPasswordPath,
};
