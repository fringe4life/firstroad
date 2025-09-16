import type { Route } from "next";

const ticketsPath: Route = "/tickets";

const homePath: Route = "/";

const ticketPath = (ticketId: string): Route => {
  return `${ticketsPath}/${ticketId}` as Route;
};

const ticketEditPath = (ticketId: string): Route => {
  return `${ticketPath(ticketId)}/edit` as Route;
};

const signInPath: Route = "/sign-in";
const signUpPath: Route = "/sign-up";
const forgotPasswordPath: Route = "/forgot-password";
const resetPasswordPath = (token: string): Route =>
  `/reset-password/${token}` as Route;
const verifyEmailPath: Route = "/verify-email";

const accountProfilePath: Route = "/account/profile";
const accountPasswordPath: Route = "/account/password";

export {
  homePath,
  forgotPasswordPath,
  resetPasswordPath,
  verifyEmailPath,
  signInPath,
  signUpPath,
  ticketEditPath,
  ticketPath,
  ticketsPath,
  accountProfilePath,
  accountPasswordPath,
};
