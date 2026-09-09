"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import type * as React from "react";

import { Button } from "@/components/ui/button";
import { cn, cva, type VariantProps } from "@/lib/utils";

const dialogContentVariants = cva({
  base: "data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 outline-none duration-100 data-closed:animate-out data-open:animate-in",
  defaultVariants: {
    size: "default",
    variant: "default",
  },
  variants: {
    size: {
      compact: "sm:max-content-narrow",
      default: "sm:max-w-sm",
      wide: "sm:max-content-widest",
    },
    variant: {
      default:
        "rounded-xl bg-popover p-4 text-popover-foreground text-sm ring-1 ring-foreground/10",
      ghost: "",
    },
  },
});

const Dialog = ({ ...props }: DialogPrimitive.Root.Props) => (
  <DialogPrimitive.Root data-slot="dialog" {...props} />
);

const DialogTrigger = ({
  nativeButton = true,
  ...props
}: DialogPrimitive.Trigger.Props) => (
  <DialogPrimitive.Trigger
    data-slot="dialog-trigger"
    nativeButton={nativeButton}
    {...props}
  />
);

const DialogPortal = ({ ...props }: DialogPrimitive.Portal.Props) => (
  <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
);

const DialogClose = ({
  nativeButton = true,
  ...props
}: DialogPrimitive.Close.Props) => (
  <DialogPrimitive.Close
    data-slot="dialog-close"
    nativeButton={nativeButton}
    {...props}
  />
);

const DialogOverlay = ({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) => (
  <DialogPrimitive.Backdrop
    className={cn(
      "data-open:fade-in-0 data-closed:fade-out-0 fixed inset-0 isolate z-50 bg-black/10 duration-100 data-closed:animate-out data-open:animate-in supports-backdrop-filter:backdrop-blur-xs",
      className,
    )}
    data-slot="dialog-overlay"
    {...props}
  />
);

const DialogContent = ({
  className,
  children,
  showCloseButton = true,
  variant,
  size,
  ...props
}: DialogPrimitive.Popup.Props &
  VariantProps<typeof dialogContentVariants> & {
    showCloseButton?: boolean;
  }) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Popup
      className={cn(dialogContentVariants({ size, variant }), className)}
      data-slot="dialog-content"
      {...props}
    >
      {children}
      {Boolean(showCloseButton) && (
        <DialogPrimitive.Close
          data-slot="dialog-close"
          render={
            <Button
              className="absolute top-2 right-2"
              size="icon-sm"
              variant="ghost"
            />
          }
        >
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Popup>
  </DialogPortal>
);

const DialogHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
    data-slot="dialog-header"
    {...props}
  />
);

const DialogFooter = ({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) => (
  <div
    className={cn(
      "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
      className,
    )}
    data-slot="dialog-footer"
    {...props}
  >
    {children}
    {Boolean(showCloseButton) && (
      <DialogPrimitive.Close render={<Button variant="outline" />}>
        Close
      </DialogPrimitive.Close>
    )}
  </div>
);

const DialogTitle = ({ className, ...props }: DialogPrimitive.Title.Props) => (
  <DialogPrimitive.Title
    className={cn("font-medium text-base leading-none", className)}
    data-slot="dialog-title"
    {...props}
  />
);

const DialogDescription = ({
  className,
  ...props
}: DialogPrimitive.Description.Props) => (
  <DialogPrimitive.Description
    className={cn(
      "text-muted-foreground text-sm *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
      className,
    )}
    data-slot="dialog-description"
    {...props}
  />
);

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
