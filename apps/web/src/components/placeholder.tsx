"use client";
import { MessageSquareWarning } from "lucide-react";
import { cloneElement } from "react";

export interface PlaceholderProps {
  label: string;
  button?: React.ReactElement<HTMLElement>;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>, "svg">;
}

const Placeholder = ({
  label,
  icon = <MessageSquareWarning />,
  button,
}: PlaceholderProps) => (
  <div className="grid h-full place-content-center gap-y-2">
    {cloneElement(icon, {
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
export { Placeholder };
