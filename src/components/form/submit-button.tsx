"use client";

import clsx from "clsx";
import { LucideLoaderCircle } from "lucide-react";
import { cloneElement } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  label?: string;
  icon?: React.ReactElement<SVGAElement>;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
};

const SubmitButton = ({ label, icon, variant, size }: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button variant={variant} size={size} type="submit" disabled={pending}>
      {pending && (
        <LucideLoaderCircle
          className={clsx({ "size-4 animate-spin": true, "mr-2": !!label })}
        />
      )}
      {label}
      {pending ? null : icon ? (
        <span className={clsx({ "ml-2": !!label })}>
          {cloneElement(icon, {
            className: "size-4",
          })}
        </span>
      ) : null}
    </Button>
  );
};
export default SubmitButton;
