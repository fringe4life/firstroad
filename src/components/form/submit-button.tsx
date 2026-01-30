"use client";

import { LucideLoaderCircle } from "lucide-react";
import { cloneElement } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  label?: string;
  icon?: React.ReactElement<SVGAElement>;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  disabled?: boolean;
  showLoader?: boolean;
}

const SubmitButton = ({
  label,
  icon,
  variant,
  size,
  disabled = false,
  showLoader = true,
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  const shouldShowLoader = showLoader && pending;
  const shouldShowIcon = !shouldShowLoader && icon;

  return (
    <Button
      disabled={pending || disabled}
      size={size}
      type="submit"
      variant={variant}
    >
      {shouldShowLoader && (
        <LucideLoaderCircle className="aspect-square w-4 animate-spin" />
      )}
      {shouldShowIcon &&
        cloneElement(icon, {
          className: "w-4 aspect-square",
        })}

      {label}
    </Button>
  );
};
export { SubmitButton };
