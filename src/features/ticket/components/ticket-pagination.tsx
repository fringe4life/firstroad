"use client";

import { useQueryStates } from "nuqs";
import Pagination from "@/components/pagination";
import {
	options as PaginationOptions,
	paginationParser,
} from "../search-params";

const TicketPagination = () => {
	const [pagination, setPagination] = useQueryStates(
		paginationParser,
		PaginationOptions,
	);

	return <Pagination pagination={pagination} setPagination={setPagination} />;
};

export default TicketPagination;
