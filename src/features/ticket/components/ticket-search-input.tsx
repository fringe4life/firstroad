"use client";

import { useQueryState } from "nuqs";
import type { ChangeEvent } from "react";
import SearchInput from "@/components/search-input";
import { searchParser } from "../search-params";

interface TicketSearchInputProps {
	placeholder?: string;
}

const TicketSearchInput = ({
	placeholder = "Search tickets ...",
}: TicketSearchInputProps) => {
	const [search, setSearch] = useQueryState("search", searchParser);

	const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
		const value = event.target.value;
		setSearch(value);
	};

	return (
		<SearchInput
			value={search}
			onChange={handleChange}
			placeholder={placeholder}
		/>
	);
};

export default TicketSearchInput;
