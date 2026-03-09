import type { useToggle } from "@/hooks/use-toggle";

export type ToggleState = ReturnType<typeof useToggle>;

export interface ConfirmDialogContextValue extends ToggleState {
  isPending: boolean;
}

export interface ClickableProps {
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export interface ConfirmDialogTriggerProps {
  asChild?: boolean;
  children: React.ReactElement<ClickableProps>;
}
