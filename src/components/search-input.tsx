"use client";

import type { ChangeEvent } from "react";
import { Input } from "./ui/input";

interface SearchInputProps  {
	value?: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	placeholder: string;
}

const SearchInput = ({
	value = "",
	onChange,
	placeholder,
}: SearchInputProps) => {
	return (
		<Input
			value={value}
			onChange={onChange}
			placeholder={placeholder}
		/>
	);
};

export default SearchInput;
