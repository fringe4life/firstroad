"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { ActionState } from "@/utils/to-action-state";

interface ActionStateWithFeedbackOptions<State extends ActionState> {
  onError?: (state: State) => void;
  onSuccess?: (state: State) => void;
  toast?: boolean;
}

type ActionStateReducer<State extends ActionState> = (
  prevState: State,
  formData: FormData,
) => Promise<State>;

const useActionStateWithFeedback = <State extends ActionState>(
  action: ActionStateReducer<State>,
  initialState: State,
  options: ActionStateWithFeedbackOptions<State> = {},
) => {
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  });

  const wrappedAction: ActionStateReducer<State> = async (
    prevState,
    formData,
  ) => {
    const next = await action(prevState, formData);
    const { onSuccess, onError, toast: showToast = true } = optionsRef.current;

    if (next.status === "SUCCESS") {
      if (showToast && next.message) {
        toast.success(next.message);
      }
      onSuccess?.(next);
    } else if (next.status === "ERROR") {
      if (showToast && next.message) {
        toast.error(next.message);
      }
      onError?.(next);
    }

    return next;
  };

  return useActionState(
    wrappedAction as ActionStateReducer<State>,
    initialState as State & Awaited<State>,
  );
};

export { useActionStateWithFeedback };
