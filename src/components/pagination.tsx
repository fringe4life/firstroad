import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { MouseEventHandler } from "react";
import type { PaginationType } from "@/features/ticket/search-params";
import { Button } from "./ui/button";

interface PaginationProps {
	pagination: PaginationType;
	setPagination: (pagination: PaginationType) => void;
}

const Pagination = ({ pagination, setPagination }: PaginationProps) => {
	const { page, limit } = pagination;

	const startOffset = page * limit + 1;
	const endOffset = (startOffset - 1) + limit;

	const label = `${startOffset} - ${endOffset} of X`;

	const handleNextPage: MouseEventHandler<HTMLButtonElement> = () => {
		setPagination({
			...pagination,
			page: page + 1,
		});
	};

	const handlePreviousPage: MouseEventHandler<HTMLButtonElement> = () => {
		setPagination({
			...pagination,
			page: page - 1,
		});
	};

	const nextButton = (
		<Button
			variant="outline"
			size="sm"
			disabled={false}
			onClick={handleNextPage}
		>
			<ChevronRightIcon />
		</Button>
	);

	const previousButton = (
		<Button
			variant="outline"
			size="sm"
			disabled={page < 1}
			onClick={handlePreviousPage}
		>
			<ChevronLeftIcon />
		</Button>
	);

	return (
		<div className="flex items-center justify-between">
			<p className="text-sm text-muted-foreground">{label}</p>
			<div className="flex items-center gap-x-2">
				{previousButton}
				{nextButton}
			</div>
		</div>
	);
};

export default Pagination;
