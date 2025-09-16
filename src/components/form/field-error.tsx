import type { ActionState } from "../../utils/to-action-state";

type FieldErrorProps = {
  actionState: ActionState;
  name: string;
};

const FieldError = ({ actionState, name }: FieldErrorProps) => {
  const error = actionState.fieldErrors[name]?.[0];
  if (!error) {
    return null;
  }
  return <span className="text-red-500 text-sm">{error}</span>;
};
export default FieldError;
