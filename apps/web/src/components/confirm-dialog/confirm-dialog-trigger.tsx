"use client";

import React from "react";
import { useConfirmDialogContext } from "./context";
import type { ClickableProps, ConfirmDialogTriggerProps } from "./types";

const ConfirmDialogTrigger = ({
  children,
  asChild = true,
}: ConfirmDialogTriggerProps) => {
  const { open, isPending } = useConfirmDialogContext();

  if (asChild && React.isValidElement(children)) {
    // Clone child and inject onClick + disabled
    return React.cloneElement(children, {
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        // Call original onClick if it exists
        children.props.onClick?.(e);
        open();
      },
      disabled: isPending || children.props.disabled,
    } as ClickableProps);
  }

  // Fallback: wrap in button
  return (
    <button disabled={isPending} onClick={open} type="button">
      {children}
    </button>
  );
};

export { ConfirmDialogTrigger };
