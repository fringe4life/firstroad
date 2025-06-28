import { ZodError } from "zod";

export type ActionState = {
  message: string;
  payload?: FormData;
  fieldErrors: Record<string, string[] | undefined>;
  status?: "SUCCESS" | "ERROR";
  timestamp: number;
};

export const EMPTY_ACTION_STATE: ActionState = {
  message: "",
  fieldErrors: {},
  timestamp: Date.now(),
};

const fromErrorToActionState = (
  err: unknown,
  formData?: FormData
): ActionState => {
  if (err instanceof ZodError) {
    return {
      message: "",
      fieldErrors: err.flatten().fieldErrors,
      payload: formData,
      status: "ERROR",
      timestamp: Date.now(),
    };
  }
  if (err instanceof Error) {
    return {
      message: err.message,
      fieldErrors: {},
      payload: formData,
      status: "ERROR",
      timestamp: Date.now(),
    };
  }
  return {
    fieldErrors: {},
    message: "An unknown error occured",
    payload: formData,
    status: "ERROR",
    timestamp: Date.now(),
  };
};
const toActionState = (
  message: string,
  status: ActionState["status"],
  formData?: FormData
): ActionState => {
  return {
    message,
    fieldErrors: {},
    status,
    timestamp: Date.now(),
    payload: formData,
  };
};
export { fromErrorToActionState, toActionState };
