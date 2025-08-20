"use client";

import { useQueryState } from "nuqs";
import type { ChangeEvent } from "react";
import { useTransition } from "react";
import { Input } from "./ui/input";

const SearchInput = (props: React.ComponentProps<typeof Input>) => {
	const [_, startTransition] = useTransition();
	const [search, setSearch] = useQueryState("search", {
		defaultValue: "",
		clearOnDefault: false,
		shallow: false,
		startTransition,
        throttleMs: 250
	});

	const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
		const value = event.target.value;
		setSearch(value || null);
	};

	return <Input value={search} onChange={handleChange} {...props} />;
};

export default SearchInput;
