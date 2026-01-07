import { MessageSquareWarning } from "lucide-react";
import { cloneElement } from "react";

interface PlaceholderProps {
  label: string;
  button?: React.ReactElement<HTMLElement>;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>, "svg">;
}

const Placeholder = ({
  label,
  icon = <MessageSquareWarning />,
  button = <div />,
}: PlaceholderProps) => (
  <div
    className="grid h-full items-center justify-center gap-y-2 place-self-center"
    data-button={Boolean(button)}
  >
    {cloneElement(icon, {
      className: "size-16 justify-self-center",
    })}
    <h2 className="text-center text-lg">{label}</h2>

    {cloneElement(button, {
      className: "h-10",
    })}
  </div>
);
export { Placeholder };
