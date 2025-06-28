import { ActionState } from "../../features/utils/to-action-state";

type FieldErrorProps = {
  actionState: ActionState;
  name: string;
};

const FieldError = ({ actionState, name }: FieldErrorProps) => {
  const error = actionState.fieldErrors[name]?.[0];
  if (!error) return null;
  return <span className="text-sm text-red-500">{error}</span>;
};
export default FieldError;
