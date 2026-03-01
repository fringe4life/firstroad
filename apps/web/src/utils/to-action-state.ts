import { APIError } from "better-auth";
import { flatten, ValiError } from "valibot";

/** Serializable payload for repopulating form fields. Must be plain object for Server Action → Client. */
export type ActionStatePayload = Record<string, string>;

export interface ActionState<T = unknown> {
  data?: T;
  fieldErrors: Record<string, string[] | undefined>;
  message: string;
  /** Plain object only (FormData/File/Date/Map cannot be passed to Client Components). */
  payload?: ActionStatePayload;
  status?: "SUCCESS" | "ERROR";
  timestamp: number;
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

  // Check for Better Auth APIError (v1.5+ uses { code, message } at top level; older versions use body)
  if (err instanceof APIError) {
    const apiError = err as {
      body?: { code?: string; message?: string };
      code?: string;
      message?: string;
    };
    const code = apiError.body?.code ?? (apiError as { code?: string }).code;
    const message =
      apiError.body?.message ?? (apiError as { message?: string }).message;

    // Map Better Auth error codes to specific fields
    const fieldErrors: Record<string, string[]> = {};

    if (code === "INVALID_PASSWORD") {
      fieldErrors.currentPassword = [message || "Invalid password"];
    } else if (code === "PASSWORD_TOO_WEAK") {
      fieldErrors.newPassword = [message || "Password is too weak"];
    } else if (code === "PASSWORD_COMPROMISED") {
      fieldErrors.newPassword = [message || "Password is compromised"];
    }

    return {
      message: message || "Authentication error",
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
