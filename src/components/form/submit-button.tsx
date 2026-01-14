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
}

const SubmitButton = ({ label, icon, variant, size }: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} size={size} type="submit" variant={variant}>
      {pending && (
        <LucideLoaderCircle className="aspect-square w-4 animate-spin" />
      )}
      {!pending &&
        icon &&
        cloneElement(icon, {
          className: "w-4 aspect-square",
        })}

      {label}
    </Button>
  );
};
export { SubmitButton };
