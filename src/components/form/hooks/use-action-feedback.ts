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

  // Wrap callbacks in useEffectEvent to prevent effect re-runs when they change
  const handleSuccess = useEffectEvent((args: onArgs) => {
    onSuccess?.(args);
  });

  const handleError = useEffectEvent((args: onArgs) => {
    onError?.(args);
  });

  // Access latest state and status via effect events to avoid extra deps
  const getLatestStatus = useEffectEvent(() => state.status);
  const getLatestState = useEffectEvent(() => state);

  const timestamp = state.timestamp;

  useEffect(() => {
    if (prevTimeStamp.current === timestamp) {
      return;
    }
    const status = getLatestStatus();
    const latestState = getLatestState();
    if (status === "SUCCESS") {
      handleSuccess({ state: latestState });
    } else if (status === "ERROR") {
      handleError({ state: latestState });
    }
    prevTimeStamp.current = timestamp;
  }, [timestamp]);
};
export { useActionFeedback };
