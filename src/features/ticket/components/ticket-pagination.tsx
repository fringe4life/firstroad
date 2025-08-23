"use client";

import { useQueryState, useQueryStates } from "nuqs";
import Pagination from "@/components/pagination";
import {
	options as PaginationOptions,
	paginationParser,
	searchParser,
} from "@/features/ticket/search-params";
import type { PaginationMetadata } from "@/features/types/pagination";
import { useEffect, useRef } from "react";

export interface TicketPaginationProps {
	metadata: PaginationMetadata;
}
const TicketPagination = ({ metadata }: TicketPaginationProps) => {
	const [pagination, setPagination] = useQueryStates(
		paginationParser,
		PaginationOptions,
	);

	
	const [search] = useQueryState("search", searchParser);
	
	const prevSearch = useRef(search);

	useEffect(() => {
		if (prevSearch.current !== search) {
			setPagination({
				...pagination,
				page: 0,
			})
			prevSearch.current = search;
		}
	}, [search, pagination, setPagination])

	return <Pagination pagination={pagination} setPagination={setPagination} metadata={metadata} 	/>;
};

export default TicketPagination;
