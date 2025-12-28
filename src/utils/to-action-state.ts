import { APIError } from "better-auth";
import { flatten, ValiError } from "valibot";

export interface ActionState<T = unknown> {
  message: string;
  payload?: FormData;
  fieldErrors: Record<string, string[] | undefined>;
  status?: "SUCCESS" | "ERROR";
  timestamp: number;
  data?: T;
}

export const EMPTY_ACTION_STATE: ActionState = {
  message: "",
  fieldErrors: {},
  timestamp: Date.now(),
};

const fromErrorToActionState = <T = unknown>(
  err: unknown,
  formData?: FormData,
): ActionState<T> => {
  if (err instanceof ValiError) {
    const flattened = flatten(err.issues);
    return {
      message: "",
      timestamp: Date.now(),
      fieldErrors: flattened.nested || {},
      payload: formData,
      status: "ERROR",
    };
  }

  // Check for Better Auth APIError
  if (err instanceof APIError) {
    const apiError = err as {
      status: string;
      body: { code?: string; message?: string };
    };

    // Map Better Auth error codes to specific fields
    const fieldErrors: Record<string, string[]> = {};

    if (apiError.body.code === "INVALID_PASSWORD") {
      fieldErrors.currentPassword = [
        apiError.body.message || "Invalid password",
      ];
    } else if (apiError.body.code === "PASSWORD_TOO_WEAK") {
      fieldErrors.newPassword = [
        apiError.body.message || "Password is too weak",
      ];
    } else if (apiError.body.code === "PASSWORD_COMPROMISED") {
      fieldErrors.newPassword = [
        apiError.body.message || "Password is compromised",
      ];
    }

    return {
      message: apiError.body.message || "Authentication error",
      fieldErrors,
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
    message: "An unknown error occurred",
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
