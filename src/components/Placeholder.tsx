import { MessageSquareWarning } from "lucide-react";
import { cloneElement } from "react";

type PlaceholderProps = {
  label: string;
  button?: React.ReactElement<HTMLElement>;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>, "svg">;
};

const Placeholder = ({
  label,
  icon = <MessageSquareWarning />,
  button = <div />,
}: PlaceholderProps) => {
  return (
    <div className="flex-1 self-center gap-y-2 justify-self-center flex flex-col items-center justify-center">
      {cloneElement(icon, {
        className: "size-16",
      })}
      <h2 className="text-lg text-center">{label}</h2>
      {cloneElement(button, {
        className: "h-10",
      })}
    </div>
  );
};
export default Placeholder;
