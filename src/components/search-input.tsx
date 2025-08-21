"use client";

import { Input } from "./ui/input";

interface SearchInputProps  {
	value?: string;
	onChange: (value: string) => void;
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
			onChange={(event) => onChange(event.target.value)}
			placeholder={placeholder}
		/>
	);
};

export default SearchInput;
