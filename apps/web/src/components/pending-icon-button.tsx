"use client";

import { LucideLoader } from "lucide-react";
import { Activity, cloneElement } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ICON_CLASSES = "aspect-square w-4";

const LOADER_CLASSES = "aspect-square w-4 animate-spin";

interface PendingIconProps {
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  /** Defaults to LucideLoader. If provided, cloned with loader styles. */
  loader?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  isPending: boolean;
}

const PendingIcon = ({ icon, loader, isPending }: PendingIconProps) => (
  <>
    <Activity mode={isPending ? "visible" : "hidden"}>
      {loader ? (
        cloneElement(loader, {
          className: cn(loader.props.className, LOADER_CLASSES),
        })
      ) : (
        <LucideLoader className={LOADER_CLASSES} />
      )}
    </Activity>
    <Activity mode={isPending ? "hidden" : "visible"}>
      {cloneElement(icon, {
        className: cn(icon.props.className, ICON_CLASSES),
      })}
    </Activity>
  </>
);

interface PendingIconButtonProps extends React.ComponentProps<typeof Button> {
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  /** Defaults to LucideLoader. If provided, cloned with loader styles. */
  loader?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
}

const PendingIconButton = ({
  icon,
  loader,
  disabled,
  ...buttonProps
}: PendingIconButtonProps) => (
  <Button disabled={disabled} {...buttonProps}>
    <PendingIcon icon={icon} isPending={Boolean(disabled)} loader={loader} />
  </Button>
);

export { PendingIcon, PendingIconButton };
