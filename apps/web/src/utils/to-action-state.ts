import { APIError } from "better-auth";
import { flatten, ValiError } from "valibot";

/** Serializable payload for repopulating form fields. Must be plain object for Server Action → Client. */
export type ActionStatePayload = Record<string, string>;

export interface ActionState<T = unknown> {
  message: string;
  /** Plain object only (FormData/File/Date/Map cannot be passed to Client Components). */
  payload?: ActionStatePayload;
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

/** Convert FormData to a plain object so action state can be serialized to the client. */
function formDataToPayload(formData: FormData): ActionStatePayload {
  const payload: ActionStatePayload = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      payload[key] = value;
    }
  }
  return payload;
}

const fromErrorToActionState = <T = unknown>(
  err: unknown,
  formData?: FormData,
): ActionState<T> => {
  const payload = formData ? formDataToPayload(formData) : undefined;

  if (err instanceof ValiError) {
    const flattened = flatten(err.issues);
    return {
      message: "",
      timestamp: Date.now(),
      fieldErrors: flattened.nested || {},
      payload,
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
      payload,
      status: "ERROR",
      timestamp: Date.now(),
    };
  }

  if (err instanceof Error) {
    return {
      message: err.message,
      fieldErrors: {},
      payload,
      status: "ERROR",
      timestamp: Date.now(),
    };
  }

  return {
    fieldErrors: {},
    message: "An unknown error occurred",
    payload,
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
  payload: formData ? formDataToPayload(formData) : undefined,
  data,
});

export { fromErrorToActionState, toActionState };
