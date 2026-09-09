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
  fieldErrors: {},
  message: "",
  timestamp: 0,
};

const PASSWORD_ERROR_REGEX = /PASSWORD/i;

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

/** Pick form password field from error code + submitted payload keys. */
function passwordFieldForError(
  code: string | undefined,
  payload?: ActionStatePayload,
): string | undefined {
  if (!(code && PASSWORD_ERROR_REGEX.test(code))) {
    return;
  }
  // Change-password: wrong current password
  if (code === "INVALID_PASSWORD" && payload && "currentPassword" in payload) {
    return "currentPassword";
  }
  if (payload && "newPassword" in payload) {
    return "newPassword";
  }
  return "password";
}

const fromErrorToActionState = <T = unknown>(
  err: unknown,
  formData?: FormData,
): ActionState<T> => {
  const payload = formData ? formDataToPayload(formData) : undefined;

  if (err instanceof ValiError) {
    const flattened = flatten(err.issues);
    return {
      fieldErrors: flattened.nested || {},
      message: "",
      payload,
      status: "ERROR",
      timestamp: Date.now(),
    };
  }

  if (err instanceof APIError) {
    const { code, message = "Authentication error" } = err.body ?? {};
    const field = passwordFieldForError(code, payload);
    return {
      fieldErrors: field ? { [field]: [message] } : {},
      message,
      payload,
      status: "ERROR",
      timestamp: Date.now(),
    };
  }

  if (err instanceof Error) {
    return {
      fieldErrors: {},
      message: err.message,
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
  data,
  fieldErrors: {},
  message,
  payload: formData ? formDataToPayload(formData) : undefined,
  status,
  timestamp: Date.now(),
});

export { fromErrorToActionState, toActionState };
