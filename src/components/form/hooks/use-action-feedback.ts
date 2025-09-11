"use client";

import { useEffect, useRef } from "react";
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
	useEffect(() => {
		if (!isNewAction) return;
		if (state.status === "SUCCESS") {
			onSuccess?.({ state });
		} else if (state.status === "ERROR") {
			onError?.({ state });
		}
		prevTimeStamp.current = state.timestamp;
	}, [onSuccess, onError, state, isNewAction]);
};
export { useActionFeedback };
