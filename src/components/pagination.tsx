import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { MouseEventHandler } from "react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { TicketPaginationProps } from "@/features/ticket/components/ticket-pagination";
import type { PaginationType } from "@/features/ticket/search-params";

interface PaginationProps {
	pagination: PaginationType;
	setPagination: (pagination: PaginationType) => void;
	metadata: TicketPaginationProps["metadata"];
}

const Pagination = ({
	pagination,
	setPagination,
	metadata,
}: PaginationProps) => {
	const { page, limit } = pagination;

	const startOffset = page * limit + 1;
	const endOffset = startOffset - 1 + limit;
	const actualEndOffset = Math.min(endOffset, metadata.count);

	const label = `${startOffset} - ${actualEndOffset} of ${metadata.count}`;

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

	const handleLimitChange = (value: string) => {
		setPagination({
			...pagination,
			limit: parseInt(value, 10),
			page: 0,
		});
	};

	const nextButton = (
		<Button
			variant="outline"
			size="sm"
			disabled={!metadata.hasNextPage}
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

	const limitDropdown = (
		<Select defaultValue={limit.toString()} onValueChange={handleLimitChange}>
			<SelectTrigger className="h-9">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="5">5</SelectItem>
				<SelectItem value="10">10</SelectItem>
				<SelectItem value="20">25</SelectItem>
				<SelectItem value="50">50</SelectItem>
				<SelectItem value="100">100</SelectItem>
			</SelectContent>
		</Select>
	);

	return (
		<div className="flex items-center justify-between">
			<p className="text-muted-foreground text-sm">{label}</p>
			<div className="flex items-center gap-x-2">
				{limitDropdown}
				{previousButton}
				{nextButton}
			</div>
		</div>
	);
};

export default Pagination;
