import type React from "react";
import { toast } from "sonner";
import type { ActionState } from "../../utils/to-action-state";
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
    onSuccess: ({ state: stateArg }) => {
      if (stateArg.message) {
        toast.success(stateArg.message || "no errors");
      }
      onSuccessState?.(stateArg);
    },
    onError: ({ state: stateArg }) => {
      if (stateArg.message) {
        toast.error(stateArg.message || "errors");
      }
      onErrorState?.(stateArg);
    },
  });
  return (
    <form action={action} className="flex flex-col gap-y-2">
      {children}
    </form>
  );
};

export default Form;
