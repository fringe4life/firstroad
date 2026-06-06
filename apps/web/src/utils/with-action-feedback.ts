import { toast } from "sonner";
import type { ActionState } from "@/utils/to-action-state";

export interface ActionFeedbackOptions<State extends ActionState> {
  onError?: (state: State) => void;
  onSuccess?: (state: State) => void;
  toast?: boolean;
}

export const withActionFeedback =
  <Return extends ActionState, Args extends unknown[]>(
    action: (...args: Args) => Promise<Return>,
    {
      onSuccess,
      onError,
      toast: showToast = true,
    }: ActionFeedbackOptions<Return> = {},
  ): ((...args: Args) => Promise<Return>) =>
  async (...args: Args) => {
    const next = await action(...args);
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
