"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import type { ActionState } from "../../../utils/to-action-state";

type onArgs = {
  state: ActionState;
};

export type FeedBackOption = {
  onSuccess?: (onArgs: onArgs) => void;
  onError?: (onArgs: onArgs) => void;
};

const useActionFeedback = (
  state: ActionState,
  { onSuccess, onError }: FeedBackOption,
) => {
  const prevTimeStamp = useRef(state.timestamp);
  const isNewAction = prevTimeStamp.current !== state.timestamp;

  // Wrap callbacks in useEffectEvent to prevent effect re-runs when they change
  const handleSuccess = useEffectEvent(() => {
    onSuccess?.({ state });
  });

  const handleError = useEffectEvent(() => {
    onError?.({ state });
  });

  useEffect(() => {
    if (!isNewAction) {
      return;
    }
    if (state.status === "SUCCESS") {
      handleSuccess();
    } else if (state.status === "ERROR") {
      handleError();
    }
    prevTimeStamp.current = state.timestamp;
  }, [state, isNewAction]); // ✅ Callbacks no longer in dependencies
};
export { useActionFeedback };
