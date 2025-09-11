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
		<div className="flex flex-1 flex-col items-center justify-center gap-y-2 self-center justify-self-center">
			{cloneElement(icon, {
				className: "size-16",
			})}
			<h2 className="text-center text-lg">{label}</h2>
			{cloneElement(button, {
				className: "h-10",
			})}
		</div>
	);
};
export default Placeholder;
