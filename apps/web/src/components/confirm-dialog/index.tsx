import { ConfirmDialog as Root } from "./confirm-dialog";
import { ConfirmDialogTrigger as Trigger } from "./confirm-dialog-trigger";

export const ConfirmDialog = Object.assign(Root, {
  Trigger,
});

// biome-ignore lint/performance/noBarrelFile: tightly coupled context and trigger
export { useConfirmDialogContext } from "./context";
