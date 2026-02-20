"use client";
import { MessageSquareWarning } from "lucide-react";
import { cloneElement } from "react";

export interface PlaceholderProps {
  button?: React.ReactElement<HTMLElement>;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>, "svg">;
  label: string;
}

const Placeholder = ({ label, icon, button }: PlaceholderProps) => {
  const resolvedIcon = icon ?? <MessageSquareWarning />;
  return (
    <div className="grid h-full place-content-center gap-y-2">
      {cloneElement(resolvedIcon, {
        className: "w-16 aspect-square justify-self-center",
      })}
      <h2 className="text-center text-lg">{label}</h2>

      {button
        ? cloneElement(button, {
            className: "h-10",
          })
        : null}
    </div>
  );
};
export { Placeholder };
