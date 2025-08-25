import type React from "react";
import { toast } from "sonner";
import type { ActionState } from "../../features/utils/to-action-state";
import { useActionFeedback } from "./hooks/use-action-feedback";

type FormProps = React.ComponentPropsWithoutRef<"form"> & {
  state: ActionState;
  onSuccessState?: (state: ActionState) => void;
  onErrorState?: (state: ActionState) => void;
};

const Form = ({
  action,
  children,
  state,
  onSuccessState,
  onErrorState,
}: FormProps) => {
  useActionFeedback(state, {
    onSuccess: ({ state }) => {
      if (state.message) toast.success(state.message || "no errors");
      onSuccessState?.(state);
    },
    onError: ({ state }) => {
      if (state.message) toast.error(state.message || "errors");
      onErrorState?.(state);
    },
  });
  return (
    <form action={action} className="flex flex-col gap-y-2">
      {children}
    </form>
  );
};

export default Form;
