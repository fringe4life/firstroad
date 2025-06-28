const ticketsPath = (): string => "/tickets";

const homePath = (): string => "/";

const ticketPath = (ticketId: string): string => {
  return `${ticketsPath()}/${ticketId}`;
};

const ticketEditPath = (ticketId: string): string => {
  return `${ticketPath(ticketId)}/edit`;
};

const signInPath = () => "/sign-in";
const signUpPath = () => "/sign-up";
const passwordForgotPath = () => "/password-forgot";
export {
  homePath,
  passwordForgotPath,
  signInPath,
  signUpPath,
  ticketEditPath,
  ticketPath,
  ticketsPath,
};
