import type { ActionState } from "../../utils/to-action-state";

type FieldErrorProps = {
  actionState: ActionState;
  name: string;
};

const FieldError = ({ actionState, name }: FieldErrorProps) => {
  // Only use fieldErrors for security (no payload fallback to avoid exposing sensitive data)
  const fieldError = actionState.fieldErrors[name];
  if (fieldError && fieldError.length > 0) {
    return <span className="text-red-500 text-sm">{fieldError[0]}</span>;
  }

  return null;
};
export default FieldError;
