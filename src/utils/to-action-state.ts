import z, { ZodError } from "zod/v4";

export type ActionState<T = unknown> = {
  message: string;
  payload?: FormData;
  fieldErrors: Record<string, string[] | undefined>;
  status?: "SUCCESS" | "ERROR";
  timestamp: number;
  data?: T;
};

export const EMPTY_ACTION_STATE: ActionState = {
  message: "",
  fieldErrors: {},
  timestamp: Date.now(),
};

const fromErrorToActionState = <T = unknown>(
  err: unknown,
  formData?: FormData,
): ActionState<T> => {
  if (err instanceof ZodError) {
    const flattened = z.flattenError(err);
    return {
      message: "",
      timestamp: Date.now(),
      fieldErrors: flattened.fieldErrors,
      payload: formData,
      status: "ERROR",
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

const toActionState = <T = unknown>(
  message: string,
  status: ActionState["status"],
  formData?: FormData,
  data?: T,
): ActionState<T> => ({
  message,
  fieldErrors: {},
  status,
  timestamp: Date.now(),
  payload: formData,
  data,
});

export { fromErrorToActionState, toActionState };
